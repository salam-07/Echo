/**
 * THE ENGINE, IN THE OPEN.
 *
 * A direct port of the feed resolution in
 * `backend/src/controllers/scroll.controller.js` (getScrollEchos, feed branch),
 * running against the sample set in `data.js`. The field names, the enum
 * values, and the order of operations are the product's own — this is not a
 * simplification of the real rule, it is the real rule with a local dataset.
 *
 * The one departure: `tagMatchType: 'none'` is in the Mongoose enum and in the
 * app's own FeedForm, and means "Echos carrying none of these tags". The
 * server currently drops that case instead of applying it, so this port
 * implements the documented intent rather than the present gap.
 *
 * Every clause returns the reason it rejected an Echo, because the whole point
 * of the sheet is that a rule which cannot be read is not a rule.
 */

const DAY = 24 * 60 * 60 * 1000;

export const DEFAULT_CONFIG = {
    tagMatchType: 'any',
    includedTags: ['silence', 'repair'],
    excludedTags: [],
    authors: [],
    dateRange: { startDate: null, endDate: null },
    sortBy: 'newestFirst',
    sortTimeRange: 'allTime',
    excludeLikedEchos: false,
};

export const SORT_LABELS = {
    mostLiked: 'MOST LIKED',
    newestFirst: 'NEWEST FIRST',
    oldestFirst: 'OLDEST FIRST',
};

export const WINDOW_LABELS = {
    '1day': '1 DAY',
    '1month': '1 MONTH',
    '1year': '1 YEAR',
    allTime: 'ALL TIME',
};

export const WINDOW_ORDER = ['1day', '1month', '1year', 'allTime'];

const WINDOW_DAYS = {
    '1day': 1,
    '1month': 30,
    '1year': 365,
    allTime: Infinity,
};

/** Days of look-back offered by the PERIOD OF RECORD scale bar. */
export const PERIOD_STOPS = [7, 30, 90, 365, null];

export const periodLabel = (days) => (days == null ? 'ALL RECORDS' : `LAST ${days} DAYS`);

/**
 * Test one Echo against one config. Returns the clause that rejected it, named
 * the way the schedule names it, so the sheet can print the reason.
 */
export const evaluate = (echo, config) => {
    const reject = (clause, detail) => ({ passes: false, clause, detail });

    // 1 — tag filtering
    if (config.includedTags.length > 0) {
        const has = config.includedTags.filter((tag) => echo.tags.includes(tag));

        if (config.tagMatchType === 'all' && has.length !== config.includedTags.length) {
            const missing = config.includedTags.filter((tag) => !echo.tags.includes(tag));
            return reject('TAG MATCH · ALL', `no ${missing.map((t) => `#${t}`).join(', ')}`);
        }
        if (config.tagMatchType === 'any' && has.length === 0) {
            return reject('TAG MATCH · ANY', 'carries none of the included tags');
        }
        if (config.tagMatchType === 'none' && has.length > 0) {
            return reject('TAG MATCH · NONE', `carries ${has.map((t) => `#${t}`).join(', ')}`);
        }
    }

    // 2 — excluded tags
    const hitExclusion = config.excludedTags.filter((tag) => echo.tags.includes(tag));
    if (hitExclusion.length > 0) {
        return reject('EXCLUDED TAG', `${hitExclusion.map((t) => `#${t}`).join(', ')}`);
    }

    // 3 — author filtering
    if (config.authors.length > 0 && !config.authors.includes(echo.author)) {
        return reject('AUTHOR', `${echo.author} not selected`);
    }

    // 4 — date range
    const { startDate, endDate } = config.dateRange;
    if (startDate && echo.createdAt < startDate) {
        return reject('PERIOD OF RECORD', `${Math.round(echo.ageDays)} days old`);
    }
    if (endDate && echo.createdAt > endDate) {
        return reject('PERIOD OF RECORD', 'after the end of the period');
    }

    // 5 — exclude Echos the viewer already liked
    if (config.excludeLikedEchos && echo.viewerLiked) {
        return reject('ALREADY LIKED', 'you liked this one');
    }

    // 6 — the most-liked window, which only applies when sorting by likes
    if (config.sortBy === 'mostLiked' && config.sortTimeRange !== 'allTime') {
        const limit = WINDOW_DAYS[config.sortTimeRange];
        if (echo.ageDays > limit) {
            return reject('MOST-LIKED WINDOW', `outside ${WINDOW_LABELS[config.sortTimeRange].toLowerCase()}`);
        }
    }

    return { passes: true, clause: null, detail: null };
};

const comparators = {
    mostLiked: (a, b) => b.likes - a.likes || b.createdAt - a.createdAt,
    newestFirst: (a, b) => b.createdAt - a.createdAt,
    oldestFirst: (a, b) => a.createdAt - b.createdAt,
};

/** Resolve a config against the sample set. Both halves come back. */
export const resolveFeed = (echos, config) => {
    const passing = [];
    const rejected = [];

    for (const echo of echos) {
        const verdict = evaluate(echo, config);
        if (verdict.passes) passing.push(echo);
        else rejected.push({ ...echo, clause: verdict.clause, detail: verdict.detail });
    }

    passing.sort(comparators[config.sortBy]);
    // The rejection register reads newest-first regardless of the rule, because
    // it is a record of what the rule did, not an output of it.
    rejected.sort(comparators.newestFirst);

    return { passing, rejected };
};

/**
 * The rule as one readable line. This is the sentence the platform owes you and
 * never writes down.
 */
export const ruleExpression = (config) => {
    const parts = [];

    if (config.includedTags.length > 0) {
        const set = config.includedTags.map((t) => `#${t}`).join(' ');
        const verb = { all: 'all of', any: 'any of', none: 'none of' }[config.tagMatchType];
        parts.push(`tags = ${verb} { ${set} }`);
    } else {
        parts.push('tags = unrestricted');
    }

    if (config.excludedTags.length > 0) {
        parts.push(`except { ${config.excludedTags.map((t) => `#${t}`).join(' ')} }`);
    }
    if (config.authors.length > 0) {
        parts.push(`by { ${config.authors.join(' ')} }`);
    }
    if (config.dateRange.startDate) {
        const days = Math.round((Date.now() - config.dateRange.startDate.getTime()) / DAY);
        parts.push(`within last ${days} days`);
    }
    if (config.excludeLikedEchos) {
        parts.push('not already liked');
    }

    parts.push(`sort = ${SORT_LABELS[config.sortBy].toLowerCase()}`);
    if (config.sortBy === 'mostLiked') {
        parts.push(`window = ${WINDOW_LABELS[config.sortTimeRange].toLowerCase()}`);
    }

    return parts.join('  ·  ');
};

/** Why nothing passed — named at the clause that did the most damage. */
export const emptyReason = (rejected, config) => {
    if (rejected.length === 0) return null;

    const tally = new Map();
    for (const echo of rejected) tally.set(echo.clause, (tally.get(echo.clause) ?? 0) + 1);

    const [clause] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];

    if (clause === 'TAG MATCH · ALL') {
        return `No Echo in the sample set carries all of ${config.includedTags.map((t) => `#${t}`).join(', ')} at once.`;
    }
    if (clause === 'TAG MATCH · ANY') return 'No Echo in the sample set carries any of the included tags.';
    if (clause === 'TAG MATCH · NONE') return 'Every Echo in the sample set carries one of the tags you asked to avoid.';
    if (clause === 'EXCLUDED TAG') return 'Your exclusions removed everything the rest of the rule let through.';
    if (clause === 'PERIOD OF RECORD') return 'Nothing in the sample set falls inside that period.';
    if (clause === 'MOST-LIKED WINDOW') return 'Nothing in the sample set is recent enough for that window.';
    if (clause === 'AUTHOR') return 'None of the selected authors wrote anything matching the rest of the rule.';
    if (clause === 'ALREADY LIKED') return 'Everything left is something you already liked.';
    return 'Nothing in the sample set satisfies this rule.';
};

/** Contradictions worth naming before the visitor blames the engine. */
export const contradictions = (config) => {
    const both = config.includedTags.filter((tag) => config.excludedTags.includes(tag));
    if (both.length === 0) return [];
    return both.map((tag) => `#${tag} is both included and excluded — the exclusion wins.`);
};
