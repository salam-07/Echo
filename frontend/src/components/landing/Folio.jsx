import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rule, Sheet } from '../editorial/Frame.jsx';
import { dispose, drawRule, useSectionMotion } from '../editorial/motion.js';

/**
 * The running head. A journal prints the reader's position at the top of every
 * page; this one does the same, and the reference it prints is the same one the
 * nav links to and the side-heads carry, so the document has one address system.
 *
 * The hairline under it is the sheet's one piece of full-width apparatus, so it
 * is also where the document's progress is measured: a second rule in solid ink
 * drawn across it, left to right, by nothing but the reader's own scroll. It is
 * a scrub with a job — the length of the line is how much of the sheet is behind
 * you — and it is the only mark on the page that is continuously in motion.
 */

const SECTIONS = [
    { id: 'objection', reference: '§01 · The objection' },
    { id: 'models', reference: '§02 · The two models' },
    { id: 'rule', reference: '§03 · The rule' },
    { id: 'join', reference: '§04 · Join' },
];

const COVER = '';

const NAV = [
    { href: '#models', label: 'Two models' },
    { href: '#rule', label: 'The rule' },
    { href: '#join', label: 'Join' },
];

const Folio = () => {
    const [reference, setReference] = useState(COVER);
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

    useEffect(() => {
        let frame = 0;

        const read = () => {
            frame = 0;
            let current = COVER;
            SECTIONS.forEach((section) => {
                const el = document.getElementById(section.id);
                if (el && el.getBoundingClientRect().top <= 140) {
                    current = section.reference;
                }
            });
            setReference((prev) => (prev === current ? prev : current));
        };

        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(read);
        };

        read();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

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
                        <p className="t-label hidden lg:block" aria-live="polite">
                            {reference}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 lg:gap-10">
                        <nav aria-label="Sections of this sheet" className="hidden md:block">
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
                            <Link to="/login" className="t-label link-rule transition-colors hover:text-ink">
                                Sign in
                            </Link>
                            <Link to="/signup" className="act act-outline h-9 px-4">
                                Create account
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
