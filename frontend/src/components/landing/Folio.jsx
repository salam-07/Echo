import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Rule, Sheet } from '../editorial/Frame.jsx';
import { dispose, drawRule, useSectionMotion } from '../editorial/motion.js';

/** Page navigation and reading progress. */

const NAV = [
    { href: '#models', label: 'How it Works' },
    // { href: '#rule', label: 'Example feeds' },
    { href: '#join', label: 'Join' },
];

const Folio = () => {
    const scope = useRef(null);

    /* The one scrub that measures the whole document. Under reduce it survives
       with the smoothing removed: a progress mark tied 1:1 to the scroll position
       is a scrollbar, not an animation, and taking it away would remove
       information rather than motion. */
    useSectionMotion(scope, {
        full: () => {
            const tween = drawRule('[data-progress]', document.documentElement, {
                axis: 'x',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.6,
            });
            return () => dispose(tween);
        },
        calm: () => {
            const tween = drawRule('[data-progress]', document.documentElement, {
                axis: 'x',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
            });
            return () => dispose(tween);
        },
    });


    return (
        <div ref={scope} className="sticky top-0 z-50 bg-paper">
            <Sheet>
                <div className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
                    <div className="flex items-baseline gap-6 lg:gap-10">
                        <Link
                            to="/"
                            className="font-display text-[1.375rem] leading-none tracking-[-0.01em] text-ink"
                        >
                            Echo
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 lg:gap-10">
                        <nav aria-label="Page sections" className="hidden md:block">
                            <ul className="flex items-center gap-6 lg:gap-8">
                                {NAV.map((item) => (
                                    <li key={item.href}>
                                        <a
                                            href={item.href}
                                            className="t-label link-rule transition-colors hover:text-ink"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="flex items-center gap-4 lg:gap-6">
                            <Link to="/login" className="t-label whitespace-nowrap link-rule transition-colors hover:text-ink">
                                Sign in
                            </Link>
                            <Link to="/signup" className="act act-outline h-9 px-4">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </Sheet>
            <div className="relative">
                <Rule />
                <div
                    aria-hidden="true"
                    data-progress
                    className="absolute inset-x-0 top-0 h-px origin-left bg-ink"
                />
            </div>
        </div>
    );
};

export default Folio;
