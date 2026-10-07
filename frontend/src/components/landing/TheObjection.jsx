import { useRef } from 'react';
import { Sheet } from '../editorial/Frame.jsx';
import { dispose, enter, inkOnly, setLines, useSectionMotion } from '../editorial/motion.js';

/** Explain why choosing your own feed matters. */

const TheObjection = () => {
    const scope = useRef(null);

    useSectionMotion(scope, {
        full: () => {
            const held = { root: scope.current, trigger: scope.current };

            const title = setLines('[data-title]', {
                ...held,
                delay: 0.3,
                duration: 1.15,
                stagger: { amount: 0.3 },
            });
            const first = setLines('[data-argument="1"]', {
                ...held,
                delay: 0.85,
                duration: 1,
                stagger: { amount: 0.4 },
            });
            const second = setLines('[data-argument="2"]', {
                ...held,
                delay: 1.2,
                duration: 1,
                stagger: { amount: 0.4 },
            });

            return () => dispose(title, first, second);
        },
        calm: () => {
            const tween = inkOnly('[data-title], [data-argument]', {
                duration: 0.5,
                stagger: 0.08,
                scrollTrigger: enter(scope.current),
            });
            return () => dispose(tween);
        },
    });

    return (
        <section
            ref={scope}
            id="objection"
            aria-labelledby="objection-title"
            className="bg-paper-shade"
        >
            <Sheet>

                <div className="grid grid-cols-12 gap-x-0 lg:gap-x-8 gap-y-12 py-24 lg:py-40">
                    <h2
                        id="objection-title"
                        data-title
                        className="t-headline col-span-12 max-w-[8em] lg:col-span-5"
                    >
                        Read what matters to you.
                    </h2>

                    <div className="col-span-12 lg:col-span-6 lg:col-start-7">
                        <p data-argument="1" className="t-deck max-w-[52ch] text-ink">
                            Social feeds often decide what to show you without explaining why.
                            Posts you care about can get lost among things you never asked to see.
                        </p>
                        <p data-argument="2" className="t-deck mt-8 max-w-[52ch] text-ink-soft">
                            Echo lets you choose the people and topics in your feed, leave out tags
                            you do not want, and change the order whenever you like.
                        </p>
                    </div>
                </div>
            </Sheet>
        </section>
    );
};

export default TheObjection;
