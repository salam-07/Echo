import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sheet } from '../editorial/Frame.jsx';
import { EASE, dispose, gsap, inkOnly, setLines, useSectionMotion } from '../editorial/motion.js';

/** Introduce Echo and the control it gives readers. */

const CoverSheet = () => {
    const scope = useRef(null);

    useSectionMotion(scope, {
        /* Reveal the heading, introduction, and actions in sequence. */
        full: () => {
            const tl = gsap.timeline({ defaults: { ease: EASE } });

            tl.from('[data-deck]', { opacity: 0, y: 12, duration: 0.9 }, 1.05)
                .from('[data-actions]', { opacity: 0, y: 12, duration: 0.9 }, 1.2);

            /* Gated on the two faces: the statement is the one line on the page
               whose reveal a font swap could visibly break. */
            const statement = setLines('[data-statement]', {
                root: scope.current,
                duration: 1.25,
                stagger: 0.16,
                delay: 0.35,
                gate: true,
            });

            return () => dispose(tl, statement);
        },
        calm: () => {
            const tl = inkOnly(
                [
                    '[data-statement]',
                    '[data-deck]',
                    '[data-actions]',
                ].join(', '),
                { duration: 0.5, stagger: 0.035 },
            );
            return () => dispose(tl);
        },
    });

    return (
        <section ref={scope} aria-labelledby="cover-statement" className="pb-20 lg:pb-32">
            <Sheet>
                <h1
                    id="cover-statement"
                    data-statement
                    className="t-display mt-16 max-w-[8em] lg:mt-24"
                >
                    <span className="block text-ink-soft">Share your thoughts.</span>
                    <span className="block text-ink">Choose your feed.</span>
                </h1>

                <div className="mt-16 grid grid-cols-12 gap-x-0 lg:gap-x-8 gap-y-16 lg:mt-24">
                    <div className="col-span-12 lg:col-span-6">
                        <p data-deck className="t-deck max-w-[46ch] text-ink-soft">
                            Echo is a social app for short text posts. Follow people, collect posts,
                            and build feeds around the topics you care about. You choose what appears
                            and how it is sorted.
                        </p>

                        <div data-actions className="mt-12 flex flex-wrap items-center gap-4">
                            <Link to="/signup" className="act h-12 px-8">
                                Create an account
                            </Link>
                            <a href="#rule" className="act act-outline h-12 px-8">
                                See example feeds
                            </a>
                        </div>
                    </div>
                </div>
            </Sheet>
        </section>
    );
};

export default CoverSheet;
