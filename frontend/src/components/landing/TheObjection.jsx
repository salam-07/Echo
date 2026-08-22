import { useRef } from 'react';
import { SectionFolio, Sheet } from '../editorial/Frame.jsx';
import { dispose, enter, ink, inkOnly, setLines, strike, useSectionMotion } from '../editorial/motion.js';

/**
 * §01 — the objection.
 *
 * The one section that argues rather than demonstrates, so it is given the
 * quietest ground and the shortest measure on the sheet. Two paragraphs, no
 * illustration, nothing to click: the page earns the right to the interactive
 * section below by first saying plainly what it objects to.
 *
 * It is also the only place on the sheet where body copy is set line by line
 * rather than simply inked. That is deliberate and unrepeated: §01 is pure
 * argument, so watching the argument compose itself is the section's content.
 * The line staggers use `amount` rather than `each`, so a paragraph that wraps
 * to ten lines on a phone takes exactly as long to set as one that wraps to five
 * on a desktop.
 */

const TheObjection = () => {
    const scope = useRef(null);

    useSectionMotion(scope, {
        full: () => {
            const held = { root: scope.current, trigger: scope.current };

            strike('[data-strike=""]', { duration: 1, stagger: 0.2, scrollTrigger: enter(scope.current) });
            ink('[data-folio] > p', {
                y: 8,
                delay: 0.3,
                stagger: 0.08,
                scrollTrigger: enter(scope.current),
            });

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
            const tween = inkOnly('[data-folio] > p, [data-title], [data-argument]', {
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
                <SectionFolio number="01" title="The objection" />

                <div className="grid grid-cols-12 gap-x-8 gap-y-12 py-24 lg:py-40">
                    <h2
                        id="objection-title"
                        data-title
                        className="t-headline col-span-12 max-w-[8em] lg:col-span-5"
                    >
                        Every feed is somebody&rsquo;s rule. Most of them are not yours.
                    </h2>

                    <div className="col-span-12 lg:col-span-6 lg:col-start-7">
                        <p data-argument="1" className="t-deck max-w-[52ch] text-ink">
                            A ranked feed is still a rule. It was written by someone else, it changes
                            without notice, and you are never shown it. That is the part worth objecting
                            to &mdash; not that a decision gets made about what you read, but that you are
                            not allowed to read the decision.
                        </p>
                        <p data-argument="2" className="t-deck mt-8 max-w-[52ch] text-ink-soft">
                            Echo hands the rule back. A <strong className="font-medium text-ink">Feed</strong>{' '}
                            is a set of conditions you write; a{' '}
                            <strong className="font-medium text-ink">Curation</strong> is a list you
                            assemble by hand. Both are legible, both are editable, and both stop being
                            anybody else&rsquo;s business.
                        </p>
                    </div>
                </div>
            </Sheet>
        </section>
    );
};

export default TheObjection;
