import { useMemo, useState } from 'react';
import { ECHOS, TAGS_IN_USE, AUTHORS } from './data';
import {
    DEFAULT_CONFIG,
    PERIOD_STOPS,
    SORT_LABELS,
    WINDOW_LABELS,
    WINDOW_ORDER,
    contradictions,
    emptyReason,
    periodLabel,
    resolveFeed,
    ruleExpression,
} from './engine';
import EchoEntry from './EchoEntry';
import { DimH } from './Dimension';

/**
 * THE SCHEDULE OF PARAMETERS, AND THE DRAWING IT PRODUCES.
 *
 * The signature interaction of the set. Left: every field of a Scroll's
 * feedConfig, each row naming the schema key it writes to. Right: the sample
 * set resolved through those fields by the engine ported in `engine.js`, with
 * the rejections printed beneath a cut line rather than swept away.
 *
 * There is no hidden term. Change a field and the rule expression, the pass
 * count, the order, and the register of what was ruled out all change with it.
 */

const DAY = 24 * 60 * 60 * 1000;
const REJECTIONS_SHOWN = 5;

/** Station marks on the window scale bar have to fit under a tick. */
const WINDOW_TICKS = { '1day': '1D', '1month': '1M', '1year': '1Y', allTime: 'ALL' };

/* --- Instruments ---------------------------------------------------------- */

const FOCUS = 'peer-focus-visible:[outline:2px_solid_var(--color-usermark)] peer-focus-visible:[outline-offset:3px]';

/** A value circled by hand, or struck out by hand. */
const Mark = ({ checked, onChange, label, children, tone = 'mark' }) => {
    const struck = tone === 'revision';
    const on = struck
        ? 'border-revision/60 text-revision line-through decoration-revision/70'
        : 'border-usermark/60 text-usermark';

    return (
        <label className="cursor-pointer select-none">
            <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} className="peer sr-only" />
            <span
                className={`typed inline-block rounded-full border px-2 py-[0.1875rem] text-[0.6875rem] leading-tight transition-colors ${FOCUS} ${
                    checked ? on : 'border-transparent text-fieldname hover:border-hairline hover:text-graphite'
                }`}
            >
                {children}
            </span>
        </label>
    );
};

/** An enum, set out as the drawing's own key: options divided by hairlines. */
const Seg = ({ name, value, options, onChange, labelledBy }) => (
    <div role="group" aria-labelledby={labelledBy} className="flex w-full border border-hairline bg-sheet/60">
        {options.map((option, index) => {
            const checked = option.value === value;
            return (
                <label
                    key={option.value}
                    className={`flex-1 cursor-pointer select-none ${index > 0 ? 'border-l border-hairline' : ''}`}
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={checked}
                        onChange={() => onChange(option.value)}
                        className="peer sr-only"
                    />
                    <span
                        className={`drafted block px-1 py-2 text-center text-[0.75rem] leading-none transition-colors ${FOCUS} ${
                            checked ? 'bg-usermark text-sheet' : 'text-fieldname hover:text-graphite'
                        }`}
                    >
                        {option.label}
                    </span>
                </label>
            );
        })}
    </div>
);

/** A scale bar: stations ticked off along a ruled track. */
const ScaleBar = ({ id, label, stops, index, onChange, format, disabled }) => (
    <div className={disabled ? 'opacity-45' : ''}>
        <input
            id={id}
            type="range"
            className="scalebar"
            min={0}
            max={stops.length - 1}
            step={1}
            value={index}
            disabled={disabled}
            aria-label={label}
            aria-valuetext={format(stops[index])}
            onChange={(event) => onChange(Number(event.target.value))}
        />
        <div aria-hidden="true" className="flex items-start justify-between">
            {stops.map((stop, i) => (
                <span key={String(stop)} className="flex flex-col items-center gap-1">
                    <span className={`h-[5px] w-px ${i === index ? 'bg-usermark' : 'bg-hairline'}`} />
                    <span
                        data-dim
                        className={`text-[0.5625rem] leading-none ${i === index ? 'text-usermark' : 'text-fieldname'}`}
                    >
                        {format(stop, true)}
                    </span>
                </span>
            ))}
        </div>
    </div>
);

/** A drawn checkbox: an empty square, or a square with a graphite fill. */
const Box = ({ checked, onChange, children }) => (
    <label className="flex cursor-pointer select-none items-start gap-2.5">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span
            aria-hidden="true"
            className={`mt-[0.1875rem] block h-3 w-3 shrink-0 border transition-colors ${FOCUS} ${
                checked ? 'border-usermark bg-usermark' : 'border-hairline bg-sheet'
            }`}
        />
        <span className={`typed text-[0.6875rem] leading-snug ${checked ? 'text-usermark' : 'text-fieldname'}`}>
            {children}
        </span>
    </label>
);

/** One numbered row of the schedule, naming the field it writes to. */
const Row = ({ n, name, field, id, children }) => (
    <div className="border-t border-hairline px-4 py-4 sm:px-5">
        <div className="flex items-baseline justify-between gap-3">
            <span id={id} className="fieldname flex items-baseline gap-2.5">
                <span data-dim className="text-hairline">
                    {n}
                </span>
                {name}
            </span>
            <span className="typed shrink-0 text-[0.625rem] leading-none text-hairline">{field}</span>
        </div>
        <div className="mt-3">{children}</div>
    </div>
);

/* --- The engine ----------------------------------------------------------- */

const FeedEngine = () => {
    const [base, setBase] = useState(DEFAULT_CONFIG);
    const [periodIndex, setPeriodIndex] = useState(PERIOD_STOPS.length - 1);
    const [showAllRejected, setShowAllRejected] = useState(false);

    const set = (patch) => setBase((current) => ({ ...current, ...patch }));
    const toggle = (key, value) =>
        setBase((current) => ({
            ...current,
            [key]: current[key].includes(value)
                ? current[key].filter((item) => item !== value)
                : [...current[key], value],
        }));

    const config = useMemo(() => {
        const days = PERIOD_STOPS[periodIndex];
        return {
            ...base,
            dateRange: {
                startDate: days == null ? null : new Date(Date.now() - days * DAY),
                endDate: null,
            },
        };
    }, [base, periodIndex]);

    const { passing, rejected } = useMemo(() => resolveFeed(ECHOS, config), [config]);
    const marked = useMemo(() => new Set(config.includedTags), [config.includedTags]);
    const notes = contradictions(config);
    const windowIndex = WINDOW_ORDER.indexOf(base.sortTimeRange);
    const byLikes = base.sortBy === 'mostLiked';

    const ruleParts = ruleExpression(config).split('  ·  ');
    const visibleRejected = showAllRejected ? rejected : rejected.slice(0, REJECTIONS_SHOWN);
    const remaining = rejected.length - visibleRejected.length;

    return (
        <div>
            {/* The sentence the platform owes you and never writes down. */}
            <div className="vellum-deep vellum mt-10 px-4 py-4 sm:mt-14 sm:px-6 sm:py-5">
                <span className="fieldname block">Rule as specified</span>
                <p className="typed mt-2.5 flex flex-wrap items-baseline text-[0.8125rem] leading-relaxed text-graphite">
                    {ruleParts.map((part, index) => (
                        <span key={part}>
                            {index > 0 ? <span className="text-hairline">&nbsp;&nbsp;·&nbsp;&nbsp;</span> : null}
                            {part}
                        </span>
                    ))}
                </p>
            </div>

            <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
                {/* ---- Left: the schedule ---- */}
                <div>
                    <div className="vellum">
                        <div className="flex items-baseline justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
                            <h2 className="drafted text-[0.9375rem] leading-none text-graphite">
                                Schedule of parameters
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setBase(DEFAULT_CONFIG);
                                    setPeriodIndex(PERIOD_STOPS.length - 1);
                                    setShowAllRejected(false);
                                }}
                                className="drafted shrink-0 text-[0.6875rem] leading-none text-fieldname underline decoration-hairline transition-colors hover:text-revision hover:decoration-revision"
                            >
                                Reset
                            </button>
                        </div>
                        <div className="rule-h-heavy mx-4 sm:mx-5" />

                        <Row n="01" name="Tag match" field="tagMatchType" id="p-match">
                            <Seg
                                name="tag-match"
                                labelledBy="p-match"
                                value={base.tagMatchType}
                                onChange={(value) => set({ tagMatchType: value })}
                                options={[
                                    { value: 'all', label: 'All' },
                                    { value: 'any', label: 'Any' },
                                    { value: 'none', label: 'None' },
                                ]}
                            />
                        </Row>

                        <Row n="02" name="Included tags" field="includedTags" id="p-included">
                            <div role="group" aria-labelledby="p-included" className="-ml-2 flex flex-wrap gap-x-1 gap-y-1.5">
                                {TAGS_IN_USE.map((tag) => (
                                    <Mark
                                        key={tag}
                                        label={`Include the tag ${tag}`}
                                        checked={base.includedTags.includes(tag)}
                                        onChange={() => toggle('includedTags', tag)}
                                    >
                                        {tag}
                                    </Mark>
                                ))}
                            </div>
                        </Row>

                        <Row n="03" name="Excluded tags" field="excludedTags" id="p-excluded">
                            <div role="group" aria-labelledby="p-excluded" className="-ml-2 flex flex-wrap gap-x-1 gap-y-1.5">
                                {TAGS_IN_USE.map((tag) => (
                                    <Mark
                                        key={tag}
                                        tone="revision"
                                        label={`Exclude the tag ${tag}`}
                                        checked={base.excludedTags.includes(tag)}
                                        onChange={() => toggle('excludedTags', tag)}
                                    >
                                        {tag}
                                    </Mark>
                                ))}
                            </div>
                        </Row>

                        <Row n="04" name="Authors" field="authors" id="p-authors">
                            <div role="group" aria-labelledby="p-authors" className="-ml-2 flex flex-wrap gap-x-1 gap-y-1.5">
                                {AUTHORS.map((author) => (
                                    <Mark
                                        key={author}
                                        label={`Only Echos by ${author}`}
                                        checked={base.authors.includes(author)}
                                        onChange={() => toggle('authors', author)}
                                    >
                                        {author}
                                    </Mark>
                                ))}
                            </div>
                        </Row>

                        <Row n="05" name="Period of record" field="dateRange" id="p-period">
                            <p className="drafted mb-1 text-[0.75rem] leading-none text-usermark">
                                {periodLabel(PERIOD_STOPS[periodIndex])}
                            </p>
                            <ScaleBar
                                id="p-period-input"
                                label="Period of record"
                                stops={PERIOD_STOPS}
                                index={periodIndex}
                                onChange={setPeriodIndex}
                                format={(stop, short) =>
                                    short ? (stop == null ? 'ALL' : String(stop)) : periodLabel(stop)
                                }
                            />
                        </Row>

                        <Row n="06" name="Sort by" field="sortBy" id="p-sort">
                            <Seg
                                name="sort-by"
                                labelledBy="p-sort"
                                value={base.sortBy}
                                onChange={(value) => set({ sortBy: value })}
                                options={[
                                    { value: 'newestFirst', label: 'Newest' },
                                    { value: 'oldestFirst', label: 'Oldest' },
                                    { value: 'mostLiked', label: 'Most liked' },
                                ]}
                            />
                        </Row>

                        <Row n="07" name="Most-liked window" field="sortTimeRange" id="p-window">
                            <p
                                className={`drafted mb-1 text-[0.75rem] leading-none ${
                                    byLikes ? 'text-usermark' : 'text-hairline'
                                }`}
                            >
                                {byLikes ? WINDOW_LABELS[base.sortTimeRange] : 'N/A — sort is not by likes'}
                            </p>
                            <ScaleBar
                                id="p-window-input"
                                label="Most-liked window"
                                stops={WINDOW_ORDER}
                                index={windowIndex}
                                disabled={!byLikes}
                                onChange={(index) => set({ sortTimeRange: WINDOW_ORDER[index] })}
                                format={(stop, short) => (short ? WINDOW_TICKS[stop] : WINDOW_LABELS[stop])}
                            />
                        </Row>

                        <Row n="08" name="Already liked" field="excludeLikedEchos" id="p-liked">
                            <Box
                                checked={base.excludeLikedEchos}
                                onChange={() => set({ excludeLikedEchos: !base.excludeLikedEchos })}
                            >
                                hide Echos I have already liked
                            </Box>
                        </Row>

                        {notes.length > 0 ? (
                            <div className="border-t border-hairline px-4 py-3.5 sm:px-5">
                                <span className="fieldname block text-revision">Revision note</span>
                                {notes.map((note) => (
                                    <p key={note} className="typed mt-1.5 text-[0.6875rem] leading-relaxed text-revision">
                                        {note}
                                    </p>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <p className="written mt-4 max-w-[40ch] text-[0.8125rem] text-fieldname">
                        Eight fields. That is the whole of it — every term Echo uses to decide what reaches you, with
                        nothing held back for later.
                    </p>
                </div>

                {/* ---- Right: the drawing ---- */}
                <div>
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="drafted text-[0.9375rem] leading-none text-graphite">The resulting feed</h2>
                        <p className="flex items-baseline gap-2 leading-none">
                            <span data-dim className="text-[2rem] leading-none text-usermark sm:text-[2.5rem]">
                                {passing.length}
                            </span>
                            <span data-dim className="text-[0.75rem] leading-none text-fieldname">
                                / {ECHOS.length}
                            </span>
                        </p>
                    </div>
                    <div className="rule-h-heavy mt-3" />
                    <DimH
                        tone="mark"
                        className="mt-6"
                        label={`${passing.length} OF ${ECHOS.length} SAMPLE ECHOS PASS`}
                    />

                    {/* The count, spoken once, for anyone reading by ear. */}
                    <p aria-live="polite" aria-atomic="true" className="sr-only">
                        {passing.length} of {ECHOS.length} sample Echos pass this rule.
                    </p>

                    {passing.length > 0 ? (
                        <ul className="mt-7">
                            {passing.map((echo) => (
                                <EchoEntry key={echo.id} echo={echo} marked={marked} />
                            ))}
                        </ul>
                    ) : (
                        <div className="mt-7 border border-dashed border-hairline px-5 py-8 text-center sm:py-12">
                            <p className="drafted text-[0.9375rem] leading-none text-revision">Nothing passes</p>
                            <p className="written mx-auto mt-3 max-w-[44ch] text-[0.9375rem]">
                                {emptyReason(rejected, config)}
                            </p>
                            <p className="typed mx-auto mt-4 max-w-[46ch] text-[0.6875rem] leading-relaxed text-fieldname">
                                An empty feed is a legitimate result, not an error. Widen a field and it fills again.
                            </p>
                        </div>
                    )}

                    {/* Below the cut line: what the rule removed, and why. */}
                    {rejected.length > 0 ? (
                        <div className="mt-12">
                            <div className="cutline" />
                            <div className="mt-5 flex items-baseline justify-between gap-4">
                                <h3 className="drafted text-[0.8125rem] leading-none text-revision">Ruled out</h3>
                                <span data-dim className="text-[0.6875rem] leading-none text-fieldname">
                                    {rejected.length} {rejected.length === 1 ? 'ENTRY' : 'ENTRIES'}
                                </span>
                            </div>
                            <p className="written mt-3 max-w-[52ch] text-[0.8125rem] text-fieldname">
                                Every rule removes something. Here is what yours removed, and the clause that did it.
                            </p>
                            <ul className="mt-5">
                                {visibleRejected.map((echo) => (
                                    <EchoEntry
                                        key={echo.id}
                                        echo={echo}
                                        marked={marked}
                                        rejection={{ clause: echo.clause, detail: echo.detail }}
                                    />
                                ))}
                            </ul>
                            {remaining > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => setShowAllRejected(true)}
                                    className="drafted mt-4 text-[0.75rem] leading-none text-fieldname underline decoration-hairline transition-colors hover:text-graphite hover:decoration-graphite"
                                >
                                    Show the remaining {remaining}
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default FeedEngine;
