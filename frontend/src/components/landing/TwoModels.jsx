import { useRef } from 'react';
import { ColumnRule, SectionFolio, Rule, Sheet } from '../editorial/Frame.jsx';
import { dispose, drawRule, enter, ink, inkOnly, setLines, strike, useSectionMotion } from '../editorial/motion.js';

/** Two ways to build a Scroll, explained without a product demo. */

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

            const model = (name) => {
                const at = `[data-model="${name}"]`;
                const article = root.querySelector(at);
                if (!article) return null;

                ink(`${at} [data-model-body]`, { delay: 0.32, scrollTrigger: enter(article) });
                return setLines(`${at} [data-model-title]`, {
                    root,
                    trigger: article,
                    delay: 0.14,
                    duration: 1,
                });
            };

            const curation = model('curation');
            const feed = model('feed');

            /* The rule dividing the two models is drawn by how far down the Feed
               the reader has come — the second of the sheet's three scrubs. */
            const divider = drawRule('[data-column-rule]', root.querySelector('[data-model="feed"]'), {
                start: 'top 78%',
                end: 'bottom 72%',
                scrub: 1.1,
            });

            /* The sharing note enters on its own cue. */
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
                        `${at} [data-model-title], ${at} [data-model-body]`,
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
                        Two ways to make it yours.
                    </h2>
                    <p
                        data-deck
                        className="t-deck col-span-12 max-w-[48ch] text-ink-soft lg:col-span-5 lg:col-start-8"
                    >
                        A Scroll is your own collection of posts, called Echos. Pick them yourself,
                        or choose what interests you and let them come to you.
                    </p>
                </div>

                <div className="mt-20 grid grid-cols-12 gap-x-8 gap-y-20 lg:mt-28">
                    {/* Hand-picked posts */}
                    <article data-model="curation" className="col-span-12 lg:col-span-5">
                        <h3 data-model-title className="t-title text-ink">Curation</h3>
                        <p data-model-body className="t-body mt-6 max-w-[46ch] text-ink-soft">
                            Collect the Echos you want to keep and arrange them in your own order.
                            A reading list, a set of favorites, a collection worth sharing. You choose every post.
                        </p>
                    </article>

                    {/* Automatically gathered posts */}
                    <article
                        data-model="feed"
                        className="relative col-span-12 lg:col-span-6 lg:col-start-7 lg:pl-8"
                    >
                        <ColumnRule />
                        <h3 data-model-title className="t-title text-ink">Feed</h3>
                        <p data-model-body className="t-body mt-6 max-w-[46ch] text-ink-soft">
                            Choose the topics and people you want to read. Matching Echos appear
                            automatically, so there is always more to discover on your terms.
                        </p>
                    </article>
                </div>

                <div data-coda className="mt-20 lg:mt-28">
                    <Rule strong strike="coda" />
                    <p className="t-body max-w-[72ch] py-6 text-ink-soft">
                        Keep either Scroll private, or make it public so others can save it too.
                    </p>
                    <Rule strike="coda" />
                </div>
            </Sheet>
        </section>
    );
};

export default TwoModels;
