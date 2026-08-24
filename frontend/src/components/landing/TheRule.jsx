import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ColumnRule, Rule, SectionFolio, Sheet } from '../editorial/Frame.jsx';
import {
    ScrollTrigger,
    dispose,
    drawRule,
    enter,
    ink,
    inkOnly,
    setLines,
    strike,
    useSectionMotion,
} from '../editorial/motion.js';
import { TAGS, formatFiled } from './corpus.js';
import {
    DEFAULT_RULE,
    SORT_OPTIONS,
    TAG_MATCH_TYPES,
    WINDOWS,
    applyRule,
    ruleSentence,
} from './rule.js';

/**
 * §03 — the rule, running.
 *
 * The one interactive region on the sheet, and the only proof that matters: the
 * visitor moves the real parameters and the column below re-sets. Refused Echos
 * are not removed — they stay in the column, dimmed, struck, and each one prints
 * the condition that refused it. A feed you can audit line by line is the thing
 * a ranked feed cannot offer, so this page shows it rather than claiming it.
 *
 * The page's one authored motion lives here: when the rule changes, the column
 * re-typesets — every entry travels from where it was to where the new rule puts
 * it, staggered, on an exponential ease-out. A printed page being re-set.
 *
 * Because that re-set is the point, the scroll reveals in this section stay out of
 * its way. Entries take ink exactly once, on first view, and clear their own
 * inline styles when they land, so the FLIP below is the only thing writing a
 * transform to an entry for the rest of the visit. The rule sentence is never
 * split into lines either: it is a live region React re-renders on every press,
 * and SplitText and React must not both own the same children.
 */

/* -- Controls ------------------------------------------------------------- */

const StopRail = ({ name, legend, options, value, onChange, disabled = false, note }) => (
    <fieldset data-control disabled={disabled} className="border-0 p-0">
        <legend className="t-label">{legend}</legend>
        <div className="mt-3 flex divide-x divide-rule border border-rule">
            {options.map((option) => (
                <label
                    key={option.value}
                    data-held={value === option.value}
                    className="stop flex-1 px-2 py-2.5 text-center text-[0.6875rem] uppercase leading-none tracking-[0.08em]"
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        disabled={disabled}
                        onChange={() => onChange(option.value)}
                        className="sr-only"
                    />
                    {option.label}
                </label>
            ))}
        </div>
        {note ? <p className="t-label mt-2.5 normal-case tracking-[0.04em]">{note}</p> : null}
    </fieldset>
);

const STATE_WORD = { in: 'admit', out: 'refuse', unset: 'ignore' };
const NEXT_STATE = { unset: 'in', in: 'out', out: 'unset' };

const TagStamps = ({ tags, onCycle }) => (
    <div data-control>
        <p className="t-label" id="tag-rail-label">
            Tags &mdash; press once to admit, again to refuse
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-labelledby="tag-rail-label">
            {TAGS.map((tag) => {
                const state = tags[tag] ?? 'unset';
                return (
                    <button
                        key={tag}
                        type="button"
                        data-state={state}
                        onClick={() => onCycle(tag)}
                        aria-label={`${tag} — currently ${STATE_WORD[state]}. Press to ${STATE_WORD[NEXT_STATE[state]]}.`}
                        className="stamp px-2.5 py-2 text-[0.8125rem] font-normal leading-none"
                    >
                        <span>{tag}</span>
                        {state === 'unset' ? null : (
                            <span className="stamp-state text-[0.625rem] font-semibold uppercase tracking-[0.12em]">
                                {STATE_WORD[state]}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
);

/* -- The corpus column ---------------------------------------------------- */

const Entry = ({ echo, ordinal, index }) => (
    <article
        data-entry={echo.id}
        data-admitted={echo.admitted}
        style={{ '--i': index }}
        className="entry grid grid-cols-12 gap-x-4 gap-y-3 border-t border-rule py-6"
    >
        <div className="col-span-12 flex items-baseline gap-4 md:col-span-2 md:block">
            <p className="t-readout">{ordinal}</p>
            <p className="t-label md:mt-2">@{echo.author}</p>
            <p className="t-label md:mt-1">{formatFiled(echo.at)}</p>
        </div>

        <div className="col-span-12 md:col-span-10">
            <p className="entry-body max-w-[64ch] text-[1.0625rem] font-light leading-[1.6]">
                {echo.body}
            </p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
                <p className="t-label">{echo.tags.join(' · ')}</p>
                <p className="t-readout text-ink-quiet">{echo.likes} likes</p>
                {echo.likedByYou ? <p className="t-label">you liked this</p> : null}
                {echo.admitted ? null : (
                    <p className="t-label t-label--ink">Withheld &mdash; {echo.reason}</p>
                )}
            </div>
        </div>
    </article>
);

/**
 * FLIP by hand: measure every entry relative to the column, let React commit the
 * new order, measure again, then play each entry back from where it was. Offsets
 * are taken against the column rather than the viewport so a scroll between
 * renders cannot skew them.
 */
const useTypeset = (containerRef, signature) => {
    const previous = useRef(null);
    const height = useRef(0);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        const base = container.getBoundingClientRect().top;
        const nodes = Array.from(container.querySelectorAll('[data-entry]'));
        const now = new Map(
            nodes.map((node) => [node.dataset.entry, node.getBoundingClientRect().top - base]),
        );

        const reduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (previous.current && !reduced) {
            const moved = [];
            nodes.forEach((node) => {
                const before = previous.current.get(node.dataset.entry);
                if (before === undefined) return;
                const delta = before - now.get(node.dataset.entry);
                if (Math.abs(delta) < 1) return;
                node.style.transition = 'none';
                node.style.transform = `translateY(${delta}px)`;
                moved.push(node);
            });

            if (moved.length) {
                requestAnimationFrame(() => {
                    moved.forEach((node, i) => {
                        node.style.transition = [
                            `transform 560ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 16}ms`,
                            `color 480ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 16}ms`,
                        ].join(', ');
                        node.style.transform = 'translateY(0)';
                    });
                });
            }
        }

        previous.current = now;

        /* A re-set usually only reorders the column, but it can also change its
           height — the withheld head arrives, or the empty state does. The column
           rule beside it is scrubbed against that height, so re-measure when it
           has actually moved, and never for an ordinary reorder. */
        const measured = container.offsetHeight;
        if (height.current && measured !== height.current) ScrollTrigger.refresh();
        height.current = measured;

        return undefined;
    }, [containerRef, signature]);
};

/* -- The section ---------------------------------------------------------- */

const TheRule = () => {
    const [rule, setRule] = useState(DEFAULT_RULE);
    const column = useRef(null);
    const scope = useRef(null);

    const { admitted, withheld, total } = useMemo(() => applyRule(rule), [rule]);
    const sentence = useMemo(() => ruleSentence(rule), [rule]);
    const signature = useMemo(() => JSON.stringify(rule), [rule]);

    useTypeset(column, signature);

    useSectionMotion(scope, {
        full: () => {
            const root = scope.current;

            /* The head. */
            strike('[data-strike=""]', { duration: 1, stagger: 0.2, scrollTrigger: enter(root) });
            ink('[data-folio] > p', { y: 8, delay: 0.3, stagger: 0.08, scrollTrigger: enter(root) });
            ink('[data-deck]', { delay: 0.7, scrollTrigger: enter(root) });
            const title = setLines('[data-title]', {
                root,
                trigger: root,
                delay: 0.3,
                stagger: { amount: 0.3 },
            });

            /* The rule as a sentence: inked, never split. */
            const said = root.querySelector('[data-sentence]');
            ink('[data-sentence] > p', {
                y: 10,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: enter(said, 'top 84%'),
            });

            /* The workbench — controls, readout, corpus — on one cue, in the order
               you would use it: parameters, then the count, then the sheet. */
            const bench = root.querySelector('[data-workbench]');
            ink('[data-controls-head] > *', { y: 8, stagger: 0.1, scrollTrigger: enter(bench) });
            ink('[data-control]', { y: 10, delay: 0.2, stagger: 0.09, scrollTrigger: enter(bench) });
            ink('[data-controls-note]', { delay: 0.9, scrollTrigger: enter(bench) });
            ink('[data-readout] > p', { y: 8, delay: 0.32, stagger: 0.1, scrollTrigger: enter(bench) });

            /* First view only, then handed back clean: every later re-set of this
               column belongs to the FLIP, and two systems must never both be
               writing a transform to the same entry. */
            ink('[data-entry]', {
                y: 8,
                duration: 0.8,
                delay: 0.55,
                stagger: { amount: 0.7 },
                clearProps: 'opacity,transform',
                scrollTrigger: enter(bench),
            });

            /* The third and last scrub: the rule dividing the parameters from the
               corpus, drawn by how far down the corpus you have read. */
            const divider = drawRule('[data-column-rule]', root.querySelector('[data-column]'), {
                start: 'top 80%',
                end: 'bottom 85%',
                scrub: 1.1,
            });

            const coda = root.querySelector('[data-coda]');
            strike('[data-strike="coda"]', { duration: 1.1, scrollTrigger: enter(coda, 'top 92%') });
            ink('[data-coda-item]', {
                delay: 0.28,
                stagger: 0.14,
                scrollTrigger: enter(coda, 'top 92%'),
            });

            return () => dispose(title, divider);
        },
        calm: () => {
            const root = scope.current;
            const bench = root.querySelector('[data-workbench]');
            const tweens = [
                inkOnly('[data-folio] > p, [data-title], [data-deck], [data-sentence] > p', {
                    duration: 0.5,
                    stagger: 0.06,
                    scrollTrigger: enter(root),
                }),
                inkOnly(
                    '[data-controls-head] > *, [data-control], [data-controls-note],' +
                        '[data-readout] > p, [data-coda-item]',
                    { duration: 0.5, stagger: 0.02, scrollTrigger: enter(bench) },
                ),
            ];
            return () => dispose(...tweens);
        },
    });

    const cycleTag = useCallback((tag) => {
        setRule((current) => {
            const next = { ...current.tags };
            const state = next[tag] ?? 'unset';
            const after = NEXT_STATE[state];
            if (after === 'unset') delete next[tag];
            else next[tag] = after;
            return { ...current, tags: next };
        });
    }, []);

    const set = useCallback((key, value) => setRule((current) => ({ ...current, [key]: value })), []);

    const orderingByLikes = rule.sortBy === 'most-liked';

    return (
        <section ref={scope} id="rule" aria-labelledby="rule-title">
            <Sheet>
                <SectionFolio number="03" title="The rule, running" />

                <div className="grid grid-cols-12 gap-x-8 gap-y-8 pt-24 lg:pt-40">
                    <h2
                        id="rule-title"
                        data-title
                        className="t-headline col-span-12 max-w-[10em] lg:col-span-6"
                    >
                        Move the rule. Watch the sheet re-set.
                    </h2>
                    <p
                        data-deck
                        className="t-body col-span-12 max-w-[54ch] text-ink-soft lg:col-span-5 lg:col-start-8"
                    >
                        Fourteen Echos, filed under eight tags. Six of a Feed Scroll&rsquo;s eight
                        parameters are live below &mdash; the same six the app writes. Nothing is
                        withheld from you silently: every Echo your rule refuses stays on the sheet and
                        prints the condition that refused it.
                    </p>
                </div>

                {/* The rule as a sentence — the whole argument for legibility, typeset. */}
                <div data-sentence className="mt-16 lg:mt-24">
                    <p className="t-label">Your rule, in words</p>
                    <p
                        className="t-title mt-5 max-w-[22.8em] text-ink-quiet"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {sentence.map((segment, i) =>
                            segment.kind === 'value' ? (
                                <strong key={i} className="font-medium text-ink">
                                    {segment.text}
                                </strong>
                            ) : (
                                <span key={i}>{segment.text}</span>
                            ),
                        )}
                    </p>
                </div>

                <div
                    data-workbench
                    className="mt-16 grid grid-cols-12 items-start gap-x-8 gap-y-16 pb-24 lg:mt-24 lg:pb-40"
                >
                    {/* Controls */}
                    <form
                        onSubmit={(event) => event.preventDefault()}
                        className="col-span-12 bg-paper-shade p-6 lg:sticky lg:top-24 lg:col-span-4 lg:p-8"
                    >
                        <div data-controls-head className="flex items-baseline justify-between gap-4">
                            <p className="t-label t-label--ink">Parameters</p>
                            <button
                                type="button"
                                onClick={() => setRule(DEFAULT_RULE)}
                                className="t-label link-rule transition-colors hover:text-ink"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="mt-8 space-y-8">
                            <StopRail
                                name="tagMatchType"
                                legend="tagMatchType"
                                options={TAG_MATCH_TYPES}
                                value={rule.tagMatchType}
                                onChange={(value) => set('tagMatchType', value)}
                                note="How many admitted tags an Echo must carry."
                            />

                            <TagStamps tags={rule.tags} onCycle={cycleTag} />

                            <StopRail
                                name="sortBy"
                                legend="sortBy"
                                options={SORT_OPTIONS}
                                value={rule.sortBy}
                                onChange={(value) => set('sortBy', value)}
                            />

                            <StopRail
                                name="likedWindow"
                                legend="likedWindow"
                                options={WINDOWS}
                                value={rule.likedWindow}
                                onChange={(value) => set('likedWindow', value)}
                                disabled={!orderingByLikes}
                                note={
                                    orderingByLikes
                                        ? 'How far back the likes are counted.'
                                        : 'Applies only when ordering by most liked.'
                                }
                            />

                            <StopRail
                                name="excludeLiked"
                                legend="excludeLiked"
                                options={[
                                    { value: 'false', label: 'keep liked' },
                                    { value: 'true', label: 'hide liked' },
                                ]}
                                value={String(rule.excludeLiked)}
                                onChange={(value) => set('excludeLiked', value === 'true')}
                            />
                        </div>

                        <div className="mt-8 border-t border-rule pt-5">
                            <p data-controls-note className="t-label normal-case tracking-[0.04em]">
                                Two further parameters &mdash; authors and dateRange &mdash; are set in
                                the app and printed on the cover for completeness.
                            </p>
                        </div>
                    </form>

                    {/* The column */}
                    <div data-column className="relative col-span-12 lg:col-span-8 lg:pl-8">
                        <ColumnRule />
                        <div
                            data-readout
                            className="flex flex-wrap items-baseline gap-x-8 gap-y-2 pb-4"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            <p className="t-readout text-ink">
                                Admitted{' '}
                                <span className="font-semibold">
                                    {String(admitted.length).padStart(2, '0')}
                                </span>
                            </p>
                            <p className="t-readout text-ink-quiet">
                                Withheld{' '}
                                <span className="font-semibold">
                                    {String(withheld.length).padStart(2, '0')}
                                </span>
                            </p>
                            <p className="t-readout text-ink-quiet">Corpus {total}</p>
                        </div>

                        <div ref={column}>
                            {admitted.length === 0 ? (
                                <div className="border-t border-ink py-10">
                                    <p className="t-title max-w-[14.4em] text-ink">
                                        Your rule admits nothing.
                                    </p>
                                    <p className="t-body mt-4 max-w-[56ch] text-ink-soft">
                                        Nothing is broken and nothing is lost. Every Echo below names the
                                        condition that refused it &mdash; loosen one and they come back.
                                    </p>
                                </div>
                            ) : (
                                admitted.map((echo, index) => (
                                    <Entry
                                        key={echo.id}
                                        echo={echo}
                                        index={index}
                                        ordinal={String(index + 1).padStart(2, '0')}
                                    />
                                ))
                            )}

                            {/* Withheld Echos hidden — restore this block to bring them back.
                            {withheld.length > 0 ? (
                                <>
                                    <div className="mt-12 border-t border-ink pt-4 pb-2">
                                        <p className="t-label t-label--ink">
                                            Withheld by your rule &mdash;{' '}
                                            {String(withheld.length).padStart(2, '0')}, each with its
                                            reason
                                        </p>
                                    </div>
                                    {withheld.map((echo, index) => (
                                        <Entry key={echo.id} echo={echo} index={index} ordinal="—" />
                                    ))}
                                </>
                            ) : null}
                            */}
                        </div>

                        <div data-coda>
                            <Rule strong strike="coda" />
                            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 pt-5">
                                <p data-coda-item className="t-label normal-case tracking-[0.04em]">
                                    Synthetic corpus. These fourteen Echos were written for this sheet and
                                    are not live platform content.
                                </p>
                                <Link data-coda-item to="/signup" className="act h-11 px-6">
                                    Write your own rule
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Sheet>
        </section>
    );
};

export default TheRule;
