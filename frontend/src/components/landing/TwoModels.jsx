import { useRef } from 'react';
import { Sheet } from '../editorial/Frame.jsx';
import { dispose, enter, ink, inkOnly, setLines, useSectionMotion } from '../editorial/motion.js';

/** Two ways to build a Scroll, explained without a product demo. */

const TwoModels = () => {
    const scope = useRef(null);

    useSectionMotion(scope, {
        full: () => {
            const root = scope.current;

            /* The head. */
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

            const coda = root.querySelector('[data-coda]');
            ink('[data-coda] p', { delay: 0.3, scrollTrigger: enter(coda, 'top 88%') });

            return () => dispose(title, curation, feed);
        },
        calm: () => {
            const root = scope.current;
            const tweens = [
                inkOnly('[data-title], [data-deck]', {
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

                <div className="grid grid-cols-12 gap-x-0 lg:gap-x-8 gap-y-10 pt-24 lg:pt-40">
                    <h2
                        id="models-title"
                        data-title
                        className="t-headline col-span-12 max-w-[9.5em] lg:col-span-6"
                    >
                        Two ways to build a Scroll.
                    </h2>
                    <p
                        data-deck
                        className="t-deck col-span-12 max-w-[48ch] text-ink-soft lg:col-span-5 lg:col-start-8"
                    >
                        Posts on Echo are called Echos. Organize them into Scrolls,
                        either by hand or with filters.
                    </p>
                </div>

                <div className="mt-20 grid grid-cols-12 gap-x-0 lg:gap-x-8 gap-y-20 lg:mt-28">
                    {/* Hand-picked posts */}
                    <article data-model="curation" className="col-span-12 lg:col-span-5">
                        <h3 data-model-title className="t-title text-ink">Curation</h3>
                        <p data-model-body className="t-body mt-6 max-w-[46ch] text-ink-soft">
                            Save Echos in a collection and put them in any order.
                            Use it for favorites, a reading list, or posts you want to share.
                        </p>
                    </article>

                    {/* Automatically gathered posts */}
                    <article
                        data-model="feed"
                        className="relative col-span-12 lg:col-span-6 lg:col-start-7"
                    >
                        <h3 data-model-title className="t-title text-ink">Feed</h3>
                        <p data-model-body className="t-body mt-6 max-w-[46ch] text-ink-soft">
                            Choose tags, people, and a sort order. Your Feed updates
                            automatically as matching Echos are posted.
                        </p>
                    </article>
                </div>

                <div data-coda className="mt-20 lg:mt-28">
                    <p className="t-body max-w-[72ch] py-6 text-ink-soft">
                        Keep your Scroll private or share it with others.
                    </p>
                </div>
            </Sheet>
        </section>
    );
};

export default TwoModels;
