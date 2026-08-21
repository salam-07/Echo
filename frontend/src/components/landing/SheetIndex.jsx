import { useEffect, useState } from 'react';

/**
 * The sheet index, as edge tabs on a drawing set.
 *
 * A set is navigated by its sheet numbers, so that is the navigation: six tabs
 * in the left margin, the current one marked in the visitor's own ink, joined
 * by a rule that fills as the set is read. Hidden below 1280px, where the
 * margin does not exist — the printed index on the last sheet carries it there.
 */

export const SHEETS = [
    { id: 'specification', number: 'E-01', title: 'Specification' },
    { id: 'section', number: 'E-02', title: 'Section through a timeline' },
    { id: 'two-ways', number: 'E-03', title: 'Two ways to specify' },
    { id: 'general-notes', number: 'E-04', title: 'General notes' },
    { id: 'the-room', number: 'E-05', title: 'The room you write in' },
    { id: 'issue', number: 'E-06', title: 'Issued for construction' },
];

const SheetIndex = () => {
    const [active, setActive] = useState(SHEETS[0].id);

    useEffect(() => {
        const sections = SHEETS.map(({ id }) => document.getElementById(id)).filter(Boolean);
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    const activeIndex = SHEETS.findIndex((sheet) => sheet.id === active);

    return (
        <nav
            aria-label="Sheet index"
            className="pointer-events-none fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
        >
            <ol className="pointer-events-auto relative flex flex-col gap-px pl-4">
                {/* The rule joining the tabs, filled to the sheet in hand. */}
                <span aria-hidden="true" className="absolute bottom-2 left-[3.55rem] top-2 w-px bg-hairline" />
                <span
                    aria-hidden="true"
                    className="absolute left-[3.55rem] top-2 w-px bg-usermark transition-[height] duration-500 ease-out"
                    style={{ height: `calc(${((activeIndex + 1) / SHEETS.length) * 100}% - 0.5rem)` }}
                />

                {SHEETS.map(({ id, number, title }) => {
                    const isActive = id === active;
                    return (
                        <li key={id} className="relative">
                            <a
                                href={`#${id}`}
                                aria-current={isActive ? 'true' : undefined}
                                className="group flex items-center gap-2 py-1.5"
                            >
                                <span
                                    data-dim
                                    className={`w-9 text-right text-[0.625rem] leading-none transition-colors ${
                                        isActive ? 'text-usermark' : 'text-fieldname group-hover:text-graphite'
                                    }`}
                                >
                                    {number.replace('E-', '')}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={`h-px transition-all duration-300 ${
                                        isActive ? 'w-4 bg-usermark' : 'w-2 bg-hairline group-hover:w-3 group-hover:bg-graphite'
                                    }`}
                                />
                                <span className="sr-only">{title}</span>
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default SheetIndex;
