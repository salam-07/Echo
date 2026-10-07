import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sheet } from '../editorial/Frame.jsx';
import { dispose, enter, ink, inkOnly, useSectionMotion } from '../editorial/motion.js';

/** Short definitions for the product terms used on this page. */

const GLOSSARY = [
    { term: 'Echo', gloss: 'A short text post.' },
    { term: 'Scroll', gloss: 'A collection or feed of Echos.' },
    { term: 'Curation', gloss: 'A Scroll with posts you choose by hand.' },
    { term: 'Feed', gloss: 'A Scroll that updates using your filters.' },
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

            return undefined;
        },
        calm: () => {
            const tween = inkOnly(
                '[data-mark], [data-glossary-head], [data-gloss]',
                { duration: 0.5, stagger: 0.02, scrollTrigger: enter(scope.current, 'top 92%') },
            );
            return () => dispose(tween);
        },
    });

    return (
        <footer ref={scope} className="pt-20 pb-16 lg:pt-28">
            <Sheet>
                <div className="grid grid-cols-12 gap-x-0 lg:gap-x-8 gap-y-14">
                    <div className="col-span-12 lg:col-span-4">
                        <p data-mark className="font-display text-[1.75rem] leading-none text-ink">
                            Echo
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
                            Echo basics
                        </h2>
                        <dl className="mt-6">
                            {GLOSSARY.map((entry) => (
                                <div
                                    key={entry.term}
                                    data-gloss
                                    className="grid grid-cols-12 gap-x-6 gap-y-1 py-3.5"
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
            </Sheet>
        </footer>
    );
};

export default Colophon;
