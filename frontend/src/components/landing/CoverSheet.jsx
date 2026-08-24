import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Rule, Sheet } from '../editorial/Frame.jsx';
import { PARAMETERS } from './corpus.js';
import { EASE, dispose, gsap, inkOnly, setLines, useSectionMotion } from '../editorial/motion.js';

/**
 * The cover.
 *
 * The statement is the whole thesis, set at anchor scale and left to bleed into
 * the air around it. Where this category puts a product screenshot, this sheet
 * prints the engine instead: all eight parameters a Feed Scroll is defined by,
 * in full, before a single claim is made about them. A specification is a
 * stronger proof than a picture of one.
 *
 * This is the one region that moves on load rather than on scroll, and it moves
 * in the order a sheet is actually made: rule the page, fill the field strip,
 * set the statement, then set the body and the table. Roughly two seconds from
 * blank paper to finished cover — slow on purpose, and the only place on the page
 * where the visitor is asked to watch rather than read.
 */

const CoverSheet = () => {
    const scope = useRef(null);

    useSectionMotion(scope, {
        /* Rule the page · fill the field strip · set the statement · set the body.
           No ScrollTrigger anywhere in here: the cover is already in view, so its
           motion is a clock, and the clock is deliberately slow. The statement is
           the only thing that travels far, and it is the only thing on the sheet
           that deserves to. */
        full: () => {
            const tl = gsap.timeline({ defaults: { ease: EASE } });

            tl.from('[data-strike=""]', {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1.1,
                stagger: 0.22,
            })
                .from('[data-field] > div', { opacity: 0, duration: 0.7, stagger: 0.07 }, 0.3)
                .from('[data-deck]', { opacity: 0, y: 12, duration: 0.9 }, 1.05)
                .from('[data-actions]', { opacity: 0, y: 12, duration: 0.9, stagger: 0.1 }, 1.2)
                .from('[data-spec-head]', { opacity: 0, duration: 0.7 }, 1.15)
                .from('[data-spec-row]', { opacity: 0, y: 8, duration: 0.7, stagger: 0.045 }, 1.25)
                .from('[data-spec-note]', { opacity: 0, duration: 0.7 }, 1.75);

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
                    '[data-field] > div',
                    '[data-statement]',
                    '[data-deck]',
                    '[data-actions]',
                    '[data-spec-head]',
                    '[data-spec-row]',
                    '[data-spec-note]',
                ].join(', '),
                { duration: 0.5, stagger: 0.035 },
            );
            return () => dispose(tl);
        },
    });

    return (
        <section ref={scope} aria-labelledby="cover-statement" className="pb-20 lg:pb-32">
            <Sheet>
                {/* The measure is em, not ch, and that is load-order, not pedantry.
                    `ch` is the advance width of "0" in whichever face is actually
                    active, so a measure in ch is a measure that changes when the
                    webfont lands: this box came out 25px wider under Georgia than
                    under Playfair, which was exactly enough for "There is no
                    algorithm here." to sit on one line and then reflow onto two the
                    instant Playfair arrived. An em is measured against the font
                    size instead, which is known before any font is.

                    8em is also the measure that breaks these two sentences where
                    they should break — after "no" and after "the" — by ordinary
                    greedy wrapping, with no balancer involved. That matters because
                    this statement is set line by line (motion.js, SET), and a split
                    freezes the greedy layout: any heading that asked a balancer for
                    a different set of breaks would be set to one rag and revert to
                    another. So the measure chooses the rag here. Widening this box
                    does not give the statement more room — the ink already stops at
                    681px — it only moves the breaks. Every display measure on this
                    sheet is set the same way. */}
                <h1
                    id="cover-statement"
                    data-statement
                    className="t-display mt-16 max-w-[8em] lg:mt-24"
                >
                    <span className="block text-ink-soft">There is no algorithm here.</span>
                    <span className="block text-ink">There is only the rule you wrote.</span>
                </h1>

                <div className="mt-16 grid grid-cols-12 gap-x-8 gap-y-16 lg:mt-24">
                    <div className="col-span-12 lg:col-span-6">
                        <p data-deck className="t-deck max-w-[46ch] text-ink-soft">
                            Echo is a social platform for short text posts. What reaches you is decided by
                            a rule you write yourself &mdash; a handful of plain conditions you can read,
                            edit, and hand to somebody else. Nothing is ranked on your behalf, and nothing
                            about the ranking is hidden from you.
                        </p>

                        <div data-actions className="mt-12 flex flex-wrap items-center gap-4">
                            <Link to="/signup" className="act h-12 px-8">
                                Create an account
                            </Link>
                            <a href="#rule" className="act act-outline h-12 px-8">
                                Read the rule
                            </a>
                        </div>

                        <p data-actions className="t-label mt-8">
                            Username and password. No email address.
                        </p>
                    </div>

                    <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:border-l lg:border-rule lg:pl-8">
                        <h2 data-spec-head className="t-label t-label--ink">
                            A feed scroll, in full &mdash; 8 parameters
                        </h2>
                        <dl className="mt-6">
                            {PARAMETERS.map((parameter) => (
                                <div key={parameter.name} data-spec-row className="border-t border-rule py-3.5">
                                    <dt className="flex items-baseline justify-between gap-4">
                                        <span className="text-[0.9375rem] font-medium leading-tight text-ink">
                                            {parameter.name}
                                        </span>
                                        {parameter.operable ? null : (
                                            <span className="t-label shrink-0">Set in app</span>
                                        )}
                                    </dt>
                                    <dd className="t-label mt-1.5">{parameter.values}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="border-t border-ink pt-3.5">
                            <p data-spec-note className="t-body text-ink-soft">
                                That is the entire engine. Six of the eight are operable further down this
                                sheet.
                            </p>
                        </div>
                    </div>
                </div>
            </Sheet>
        </section>
    );
};

export default CoverSheet;
