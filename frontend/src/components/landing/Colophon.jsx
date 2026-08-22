import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Rule, Sheet } from '../editorial/Frame.jsx';
import { dispose, enter, ink, inkOnly, strike, useSectionMotion } from '../editorial/motion.js';

/**
 * The colophon.
 *
 * A printed document ends by accounting for itself: what its words mean, what it
 * was set in, and what on it was authored rather than observed. The glossary is
 * not filler — Echo, Scroll, Curation and Feed are used precisely everywhere in
 * the product, and a reader who leaves this page with them straight will not be
 * confused by a single screen inside it.
 *
 * The last thing the sheet does is the quietest. No type is set here and nothing
 * travels more than a few pixels: the wordmark and the glossary simply take ink,
 * and one hairline is drawn under it all. A document should not end on a flourish.
 */

const GLOSSARY = [
    { term: 'Echo', gloss: 'A short text post. The only kind of thing anyone writes here.' },
    { term: 'Scroll', gloss: 'A collection of Echos. Every Scroll is either a Curation or a Feed.' },
    { term: 'Curation', gloss: 'A Scroll you fill by hand, in an order you choose.' },
    { term: 'Feed', gloss: 'A Scroll defined by conditions. It fills and empties itself.' },
    { term: 'Tag', gloss: 'A word filed against an Echo. What a Feed’s conditions are written about.' },
    { term: 'Community', gloss: 'A space where Echos are written to a shared subject.' },
];

const Colophon = () => {
    const scope = useRef(null);

    useSectionMotion(scope, {
        full: () => {
            const root = scope.current;
            ink('[data-mark]', { y: 8, stagger: 0.12, scrollTrigger: enter(root, 'top 92%') });
            ink('[data-glossary-head]', { y: 8, delay: 0.2, scrollTrigger: enter(root, 'top 92%') });
            ink('[data-gloss]', {
                y: 8,
                duration: 0.75,
                delay: 0.32,
                stagger: 0.06,
                scrollTrigger: enter(root, 'top 92%'),
            });

            const foot = root.querySelector('[data-imprint]');
            strike('[data-strike=""]', { duration: 1.2, scrollTrigger: enter(foot, 'top 96%') });
            ink('[data-imprint] p', {
                y: 6,
                delay: 0.25,
                stagger: 0.1,
                scrollTrigger: enter(foot, 'top 96%'),
            });
            return undefined;
        },
        calm: () => {
            const tween = inkOnly(
                '[data-mark], [data-glossary-head], [data-gloss], [data-imprint] p',
                { duration: 0.5, stagger: 0.02, scrollTrigger: enter(scope.current, 'top 92%') },
            );
            return () => dispose(tween);
        },
    });

    return (
        <footer ref={scope} className="pt-20 pb-16 lg:pt-28">
            <Sheet>
                <div className="grid grid-cols-12 gap-x-8 gap-y-14">
                    <div className="col-span-12 lg:col-span-4">
                        <p data-mark className="font-display text-[1.75rem] leading-none text-ink">
                            Echo
                        </p>
                        <p data-mark className="t-deck mt-5 max-w-[24ch] text-ink-soft">
                            No algorithms, no noise. Only the rule you wrote.
                        </p>

                        <div data-mark className="mt-10 flex flex-wrap items-center gap-4">
                            <Link to="/signup" className="act h-11 px-6">
                                Create an account
                            </Link>
                            <Link to="/login" className="act act-outline h-11 px-6">
                                Sign in
                            </Link>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-7 lg:col-start-6">
                        <h2 data-glossary-head className="t-label t-label--ink">
                            The words this sheet uses
                        </h2>
                        <dl className="mt-6">
                            {GLOSSARY.map((entry) => (
                                <div
                                    key={entry.term}
                                    data-gloss
                                    className="grid grid-cols-12 gap-x-6 gap-y-1 border-t border-rule py-3.5"
                                >
                                    <dt className="col-span-12 text-[0.9375rem] font-medium leading-tight text-ink sm:col-span-3">
                                        {entry.term}
                                    </dt>
                                    <dd className="col-span-12 text-[0.9375rem] font-light leading-[1.55] text-ink-soft sm:col-span-9">
                                        {entry.gloss}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <div data-imprint className="mt-16">
                    <Rule strike />
                    <div className="flex flex-col gap-3 py-5 md:flex-row md:items-baseline md:justify-between md:gap-8">
                        <p className="t-label normal-case tracking-[0.04em]">
                            Set in Playfair Display and Inter. Specification sheet 01, issued 22 August 2026.
                        </p>
                        <p className="t-label normal-case tracking-[0.04em] md:text-right">
                            The fourteen Echos in §03 were written for this sheet.
                        </p>
                    </div>
                </div>
            </Sheet>
        </footer>
    );
};

export default Colophon;
