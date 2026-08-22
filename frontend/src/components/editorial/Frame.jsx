import { useLayoutEffect } from 'react';

/**
 * Shared apparatus for the printed sheet — the measure, the rules, the running
 * heads, and the ground the document sits on. The landing page and the two auth
 * pages are one document in this world, so they share this frame rather than each
 * re-deriving it. Nothing here draws a box: this world has no cards, so structure
 * is carried by the measure and by hairlines alone.
 */

/** The 1280px measure with DESIGN.md's 24px mobile / 80px desktop margins. */
export const Sheet = ({ as: Tag = 'div', className = '', children }) => (
    <Tag className={`mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-20 ${className}`}>
        {children}
    </Tag>
);

/**
 * The app's DaisyUI ground would otherwise show through overscroll and behind the
 * scrollbar on these routes. Pinned to paper for the life of the route, then
 * handed back exactly as it was found.
 */
export const useEditorialGround = () => {
    useLayoutEffect(() => {
        const root = document.documentElement;
        const previous = {
            background: root.style.backgroundColor,
            scheme: root.style.colorScheme,
            scrollbar: root.style.scrollbarColor,
        };
        root.style.backgroundColor = '#f9f9f9';
        root.style.colorScheme = 'light';
        root.style.scrollbarColor = '#747878 transparent';
        return () => {
            root.style.backgroundColor = previous.background;
            root.style.colorScheme = previous.scheme;
            root.style.scrollbarColor = previous.scrollbar;
        };
    }, []);
};

/**
 * A hairline. `strike` marks it for the section's own motion to draw across —
 * pass `true` for the section's own cue, or a name (`strike="coda"`) when a rule
 * sits far enough down the section to need a cue of its own. Unmarked, it is
 * simply there. `tone="chalk"` is the same rule on an inverted spread. The rule
 * is always painted: motion decides when it is drawn, never whether it exists.
 */
export const Rule = ({ strong = false, strike = false, tone = 'ink', className = '' }) => {
    const ink = tone === 'chalk'
        ? (strong ? 'bg-chalk' : 'bg-chalk-dim')
        : (strong ? 'bg-ink' : 'bg-rule');

    return (
        <div
            aria-hidden="true"
            data-strike={strike === true ? '' : strike || undefined}
            className={`h-px w-full ${ink} ${className}`}
        />
    );
};

/**
 * The vertical rule between two columns, drawn down the height of the set type.
 * A real element rather than a border, because its length is scrubbed to how far
 * the reader has come down the column beside it. Its parent must be `relative`.
 */
export const ColumnRule = ({ tone = 'ink' }) => (
    <div
        aria-hidden="true"
        data-column-rule
        className={`pointer-events-none absolute left-0 top-0 hidden h-full w-px origin-top lg:block ${
            tone === 'chalk' ? 'bg-chalk-dim' : 'bg-rule'
        }`}
    />
);

/**
 * A section's running head: its name and its file number, ruled above and below
 * and set across the full measure. It is document apparatus — the same address
 * the nav links to and the folio at the top of the window prints — never a
 * label leaning on the heading below it.
 */
export const SectionFolio = ({ number, title, right, tone = 'ink' }) => {
    const chalk = tone === 'chalk';
    return (
        <>
            <Rule strike tone={tone} />
            <div className="flex items-baseline justify-between gap-6 py-4" data-folio>
                <p className={`t-label ${chalk ? 'text-chalk' : 't-label--ink'}`}>{title}</p>
                <p className={`t-label ${chalk ? 'text-chalk-dim' : ''}`}>{right ?? `§${number}`}</p>
            </div>
            <Rule strike tone={tone} />
        </>
    );
};
