import { ECHOS, SHEET_DATE } from './corpus.js';

/**
 * The rule engine behind §03.
 *
 * These are the same six declarative parameters a Feed Scroll is defined by in
 * the app, evaluated in the browser against the sheet's authored corpus. Nothing
 * here ranks, weights, decays, or personalises: an Echo is admitted because the
 * printed rule admits it, and every refusal names itself.
 */

export const TAG_MATCH_TYPES = [
    { value: 'all', label: 'all' },
    { value: 'any', label: 'any' },
    { value: 'none', label: 'none' },
];

export const SORT_OPTIONS = [
    { value: 'most-liked', label: 'most liked' },
    { value: 'newest', label: 'newest' },
    { value: 'oldest', label: 'oldest' },
];

export const WINDOWS = [
    { value: 'day', label: '1 day', phrase: 'the last day' },
    { value: 'month', label: '1 month', phrase: 'the last month' },
    { value: 'year', label: '1 year', phrase: 'the last year' },
    { value: 'all', label: 'all time', phrase: 'all time' },
];

export const DEFAULT_RULE = {
    tagMatchType: 'any',
    // tag → 'in' (admitted) | 'out' (refused). Absent means the rule ignores it.
    tags: { typography: 'in', 'negative-space': 'in', 'hot-takes': 'out' },
    sortBy: 'most-liked',
    likedWindow: 'year',
    excludeLiked: false,
};

const DAY = 86400000;

const cutoffFor = (window) => {
    const sheet = Date.parse(`${SHEET_DATE}T00:00:00Z`);
    if (window === 'day') return sheet - DAY;
    if (window === 'month') return sheet - 30 * DAY;
    if (window === 'year') return sheet - 365 * DAY;
    return null;
};

export const partitionTags = (tags) => ({
    included: Object.keys(tags).filter((t) => tags[t] === 'in'),
    excluded: Object.keys(tags).filter((t) => tags[t] === 'out'),
});

/**
 * Returns every Echo in the corpus, in the order the rule prints them, each
 * carrying whether the rule admitted it and — when it did not — the one reason
 * that refused it. Refused Echos are returned rather than dropped: seeing what
 * your own rule removed is the entire argument.
 */
export const applyRule = (rule) => {
    const { included, excluded } = partitionTags(rule.tags);
    const cutoff = rule.sortBy === 'most-liked' ? cutoffFor(rule.likedWindow) : null;

    const judged = ECHOS.map((echo) => {
        const hit = included.filter((t) => echo.tags.includes(t));
        const refusedTag = excluded.find((t) => echo.tags.includes(t));

        let reason = null;

        if (refusedTag) {
            reason = `refused tag · ${refusedTag}`;
        } else if (included.length > 0) {
            if (rule.tagMatchType === 'all' && hit.length !== included.length) {
                reason = 'missing an admitted tag';
            } else if (rule.tagMatchType === 'any' && hit.length === 0) {
                reason = 'carries no admitted tag';
            } else if (rule.tagMatchType === 'none' && hit.length > 0) {
                reason = `carries ${hit[0]}`;
            }
        }

        if (!reason && rule.excludeLiked && echo.likedByYou) {
            reason = 'you already liked it';
        }

        if (!reason && cutoff !== null && Date.parse(`${echo.at}T00:00:00Z`) < cutoff) {
            reason = 'outside the window';
        }

        return { ...echo, admitted: reason === null, reason };
    });

    const compare = (a, b) => {
        if (rule.sortBy === 'newest') return Date.parse(b.at) - Date.parse(a.at);
        if (rule.sortBy === 'oldest') return Date.parse(a.at) - Date.parse(b.at);
        return b.likes - a.likes;
    };

    const admitted = judged.filter((e) => e.admitted).sort(compare);
    const withheld = judged.filter((e) => !e.admitted).sort(compare);

    return { admitted, withheld, total: judged.length };
};

/**
 * The rule as a sentence. Returns segments so the page can typeset the live
 * values in ink and the connective tissue quiet — the point being that a rule
 * you can read aloud is a rule you can hold someone to.
 */
export const ruleSentence = (rule) => {
    const { included, excluded } = partitionTags(rule.tags);
    const segments = [];
    const say = (text) => segments.push({ kind: 'text', text });
    const set = (text) => segments.push({ kind: 'value', text });

    if (included.length === 0) {
        say('Admit every Echo');
    } else {
        say('Admit an Echo carrying ');
        set(rule.tagMatchType);
        say(' of ');
        included.forEach((tag, i) => {
            if (i > 0) say(i === included.length - 1 ? ' and ' : ', ');
            set(tag);
        });
    }

    if (excluded.length > 0) {
        say(', never ');
        excluded.forEach((tag, i) => {
            if (i > 0) say(i === excluded.length - 1 ? ' or ' : ', ');
            set(tag);
        });
    }

    say('. Order what is left by ');
    set(SORT_OPTIONS.find((o) => o.value === rule.sortBy).label);

    if (rule.sortBy === 'most-liked') {
        say(' within ');
        set(WINDOWS.find((w) => w.value === rule.likedWindow).phrase);
    }

    say(rule.excludeLiked ? ', and hide what I have already liked.' : ', and keep what I have already liked.');

    return segments;
};
