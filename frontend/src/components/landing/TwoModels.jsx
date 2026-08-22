import { useRef } from 'react';
import { ColumnRule, SectionFolio, Rule, Sheet } from '../editorial/Frame.jsx';
import { dispose, drawRule, enter, ink, inkOnly, setLines, strike, useSectionMotion } from '../editorial/motion.js';

/**
 * §02 — the two models.
 *
 * The two columns are deliberately not twins. A Curation is an ordered list, so
 * it is set as one, numbered, and the numbers carry the only information that
 * matters about it: the order you chose. A Feed has no order — it is a standing
 * condition — so it is set as a field list with no numbers at all. Giving these
 * two things the same card would be the lie this section exists to avoid.
 *
 * The motion carries the same argument, and it is the only place on the sheet
 * where two identical structures are revealed differently. Both columns run the
 * exact same sequence through `model()`; the single parameter that differs is the
 * row stagger. The Curation arrives one item at a time, because its order is its
 * content. The Feed arrives all at once, because a condition has no first row.
 */

const CURATED = [
    { author: 'tsuchiya', body: 'The best room in the building is the one they could not find a use for.' },
    {
        author: 'mira.k',
        body: 'Margins are not empty. They are the part of the page that agrees to stay quiet so the rest can be heard.',
    },
    { author: 'dinah.w', body: 'A grid is not a constraint. It is a promise: I will not move this without telling you.' },
    {
        author: 'mira.k',
        body: 'Leading is the sound of the room the words get read in. Set it too tight and everybody whispers.',
    },
];

const CONDITIONS = [
    { name: 'tagMatchType', value: 'any' },
    { name: 'includedTags', value: 'typography, letterpress, print' },
    { name: 'excludedTags', value: 'hot-takes' },
    { name: 'sortBy', value: 'most liked' },
    { name: 'likedWindow', value: '1 month' },
    { name: 'excludeLiked', value: 'true' },
    { name: 'authors', value: 'any' },
    { name: 'dateRange', value: 'unset' },
];

const TwoModels = () => {
    const scope = useRef(null);

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

            /* One sequence, run twice. `stagger` is the whole difference, and the
               whole point: 0.11s between rows says "this list has an order",
               0 says "this condition does not". */
            const model = (name, { stagger, rows }) => {
                const at = `[data-model="${name}"]`;
                const article = root.querySelector(at);
                if (!article) return null;

                ink(`${at} [data-eyebrow]`, { y: 8, scrollTrigger: enter(article) });
                ink(`${at} [data-model-body]`, { delay: 0.32, scrollTrigger: enter(article) });
                ink(`${at} [data-scroll-head] > p`, {
                    y: 8,
                    delay: 0.5,
                    stagger: 0.08,
                    scrollTrigger: enter(article),
                });
                ink(`${at} [data-row]`, {
                    y: 8,
                    duration: 0.8,
                    delay: 0.68,
                    stagger,
                    scrollTrigger: enter(article),
                });
                ink(`${at} [data-model-note]`, {
                    delay: 0.68 + stagger * rows + 0.15,
                    scrollTrigger: enter(article),
                });

                return setLines(`${at} [data-model-title]`, {
                    root,
                    trigger: article,
                    delay: 0.14,
                    duration: 1,
                });
            };

            const curation = model('curation', { stagger: 0.11, rows: 4 });
            const feed = model('feed', { stagger: 0, rows: 8 });

            /* The rule dividing the two models is drawn by how far down the Feed
               the reader has come — the second of the sheet's three scrubs. */
            const divider = drawRule('[data-column-rule]', root.querySelector('[data-model="feed"]'), {
                start: 'top 78%',
                end: 'bottom 72%',
                scrub: 1.1,
            });

            /* The coda, a screen and a half below the head, on its own cue. */
            const coda = root.querySelector('[data-coda]');
            strike('[data-strike="coda"]', {
                duration: 1.1,
                stagger: 0.5,
                scrollTrigger: enter(coda, 'top 88%'),
            });
            ink('[data-coda] p', { delay: 0.3, scrollTrigger: enter(coda, 'top 88%') });

            return () => dispose(title, curation, feed, divider);
        },
        calm: () => {
            const root = scope.current;
            const tweens = [
                inkOnly('[data-folio] > p, [data-title], [data-deck]', {
                    duration: 0.5,
                    stagger: 0.08,
                    scrollTrigger: enter(root),
                }),
                ...['curation', 'feed'].map((name) => {
                    const at = `[data-model="${name}"]`;
                    return inkOnly(
                        `${at} [data-eyebrow], ${at} [data-model-title], ${at} [data-model-body],` +
                            `${at} [data-scroll-head] > p, ${at} [data-row], ${at} [data-model-note]`,
                        { duration: 0.5, stagger: 0.02, scrollTrigger: enter(root.querySelector(at)) },
                    );
                }),
                inkOnly('[data-coda] p', {
                    duration: 0.5,
                    scrollTrigger: enter(root.querySelector('[data-coda]'), 'top 88%'),
                }),
            ];
            return () => dispose(...tweens);
        },
    });

    return (
        <section ref={scope} id="models" aria-labelledby="models-title">
            <Sheet>
                <SectionFolio number="02" title="The two models" />

                <div className="grid grid-cols-12 gap-x-8 gap-y-10 pt-24 lg:pt-40">
                    <h2
                        id="models-title"
                        data-title
                        className="t-headline col-span-12 max-w-[9.5em] lg:col-span-6"
                    >
                        Two ways to curate. One mental model.
                    </h2>
                    <p
                        data-deck
                        className="t-deck col-span-12 max-w-[48ch] text-ink-soft lg:col-span-5 lg:col-start-8"
                    >
                        A Scroll is either a list you made or a rule you wrote. There is no third kind, and
                        a Scroll is never quietly both.
                    </p>
                </div>

                <div className="mt-20 grid grid-cols-12 gap-x-8 gap-y-20 lg:mt-28">
                    {/* Curation — manual, ordered, finite */}
                    <article data-model="curation" className="col-span-12 lg:col-span-5">
                        <p data-eyebrow className="t-label">Manual &middot; an ordered list</p>
                        <h3 data-model-title className="t-title mt-4 text-ink">Curation</h3>
                        <p data-model-body className="t-body mt-6 max-w-[46ch] text-ink-soft">
                            You add Echos one at a time and put them in the order you want them read.
                            Nothing enters a Curation that you did not place there yourself.
                        </p>

                        <div className="mt-12">
                            <div
                                data-scroll-head
                                className="flex items-baseline justify-between gap-4 pb-4"
                            >
                                <p className="font-display text-[1.25rem] leading-tight text-ink">
                                    Rooms with nothing in them
                                </p>
                                <p className="t-label shrink-0">4 items</p>
                            </div>
                            <ol>
                                {CURATED.map((item, index) => (
                                    <li
                                        key={item.body}
                                        data-row
                                        className="grid grid-cols-12 gap-x-4 border-t border-rule py-5"
                                    >
                                        <p className="t-readout col-span-2 text-ink-quiet">
                                            {String(index + 1).padStart(2, '0')}
                                        </p>
                                        <div className="col-span-10">
                                            <p className="text-[0.9375rem] font-light leading-[1.6] text-ink">
                                                {item.body}
                                            </p>
                                            <p className="t-label mt-2">@{item.author}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                            <div className="border-t border-ink pt-4">
                                <p data-model-note className="t-label">
                                    Order is yours. It changes when you change it.
                                </p>
                            </div>
                        </div>
                    </article>

                    {/* Feed — declarative, unordered, standing */}
                    <article
                        data-model="feed"
                        className="relative col-span-12 lg:col-span-6 lg:col-start-7 lg:pl-8"
                    >
                        <ColumnRule />
                        <p data-eyebrow className="t-label">Rule-based &middot; a standing condition</p>
                        <h3 data-model-title className="t-title mt-4 text-ink">Feed</h3>
                        <p data-model-body className="t-body mt-6 max-w-[46ch] text-ink-soft">
                            You write the conditions once. Any Echo that satisfies them appears; any Echo
                            that stops satisfying them leaves. You never touch the list.
                        </p>

                        <div className="mt-12">
                            <div
                                data-scroll-head
                                className="flex items-baseline justify-between gap-4 pb-4"
                            >
                                <p className="font-display text-[1.25rem] leading-tight text-ink">
                                    Type, without the takes
                                </p>
                                <p className="t-label shrink-0">8 conditions</p>
                            </div>
                            <dl>
                                {CONDITIONS.map((condition) => (
                                    <div
                                        key={condition.name}
                                        data-row
                                        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule py-4"
                                    >
                                        <dt className="text-[0.9375rem] font-medium leading-tight text-ink">
                                            {condition.name}
                                        </dt>
                                        <dd className="t-readout text-ink-soft">{condition.value}</dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="border-t border-ink pt-4">
                                <p data-model-note className="t-label">
                                    No order to keep. The condition keeps it.
                                </p>
                            </div>
                        </div>
                    </article>
                </div>

                <div data-coda className="mt-20 lg:mt-28">
                    <Rule strong strike="coda" />
                    <p className="t-body max-w-[72ch] py-6 text-ink-soft">
                        Both are Scrolls. Either can be kept private or made public, and a public one can
                        be saved by anybody who wants to read on your terms for a while.
                    </p>
                    <Rule strike="coda" />
                </div>
            </Sheet>
        </section>
    );
};

export default TwoModels;
