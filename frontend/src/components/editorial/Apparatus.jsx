import { Link, NavLink } from 'react-router-dom';

/**
 * The application's print furniture.
 *
 * The landing sheet has `Frame.jsx` — a 1280px measure, hairlines, running heads.
 * The app needs a narrower vocabulary, because an Echo is at most 1000 characters
 * and a 1280px line of it is unreadable. Everything an app screen is built from
 * lives here, so twenty screens share one set of margins, one heading position,
 * one empty state, and one end-of-sheet mark rather than re-deriving them.
 *
 * Nothing here draws a box. Structure is the measure and the hairline.
 */

/**
 * The reading measure: 720px, which sets `t-body` at roughly 70 characters.
 * `wide` opens it to 1080px for the browse and tag grids, where the unit of
 * content is a row of names rather than a paragraph.
 */
export const Measure = ({ wide = false, className = '', children }) => (
    <div
        className={`mx-auto w-full ${wide ? 'max-w-[1080px]' : 'max-w-[720px]'} px-6 lg:px-10 ${className}`}
    >
        {children}
    </div>
);

/**
 * A screen's head. The label row carries the address and the count; the subject
 * is the one Playfair line on the screen; the deck explains it when it needs
 * explaining. Ruled below, never above — the running head's own hairline is
 * already sitting there.
 */
export const SheetHead = ({ label, subject, readout, deck, actions, children }) => (
    <header className="pt-8 pb-6">
        {(label || readout) && (
            <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-3">
                <p className="t-label t-label--ink">{label}</p>
                {readout ? <p className="t-readout text-ink-quiet">{readout}</p> : null}
            </div>
        )}

        {subject ? (
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
                <h1 className="t-subject">{subject}</h1>
                {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
            </div>
        ) : null}

        {deck ? <p className="t-body mt-3 max-w-[52ch] text-ink-soft">{deck}</p> : null}

        {children}
    </header>
);

/**
 * A division within a sheet: a heading on a full rule, and either a count in the
 * right margin or the link that opens the whole of it. Same rule weight as the
 * sheet head's, so a section reads as a subordinate of the page and not as a
 * second page.
 */
export const Section = ({ label, readout, to, seeAll = 'See all', className = '', children }) => (
    <section className={`mt-12 ${className}`}>
        <div className="flex items-baseline justify-between gap-6 border-b border-ink pb-3">
            <h2 className="t-label t-label--ink">{label}</h2>
            {to ? (
                <Link to={to} className="t-label text-rule-strong transition-colors hover:text-ink">
                    {seeAll} <span aria-hidden="true">↗</span>
                </Link>
            ) : readout ? (
                <p className="t-readout text-ink-quiet">{readout}</p>
            ) : null}
        </div>
        {children}
    </section>
);

/**
 * A printed notice: empty states, errors, first-run. Left-aligned, because a
 * notice centred in a column is a dialog and this is a page. The statement is set
 * in the display face so it reads as the page's own voice rather than as an
 * apology in the interface's voice.
 */
export const Notice = ({ statement, note, actions }) => (
    <div className="border-t border-ink py-14">
        <p className="t-title max-w-[22em]">{statement}</p>
        {note ? <p className="t-body mt-4 max-w-[48ch] text-ink-soft">{note}</p> : null}
        {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
);

/** A failed request, named, with the recovery beside it. */
export const Failure = ({ note, onRetry }) => (
    <div className="border-t border-alarm py-10" role="alert">
        <p className="t-body text-ink">{note}</p>
        {onRetry ? (
            <button type="button" onClick={onRetry} className="act act-outline mt-6 h-10 px-6">
                Try again
            </button>
        ) : null}
    </div>
);

/**
 * What sits where content will be while the request is out. Hairline-ruled bars
 * at the widths of the type they stand in for, so the column does not jump when
 * the real thing lands.
 */
export const Placeholder = ({ rows = 5 }) => (
    <div aria-hidden="true" className="animate-pulse">
        {Array.from({ length: rows }).map((_, row) => (
            <div key={row} className="border-b border-rule py-6">
                <div className="h-2.5 w-28 bg-paper-dim" />
                <div className="mt-4 space-y-2">
                    <div className="h-3.5 w-full bg-paper-dim" />
                    <div className="h-3.5 w-[92%] bg-paper-dim" />
                    <div className="h-3.5 w-[64%] bg-paper-dim" />
                </div>
                <div className="mt-4 h-2.5 w-40 bg-paper-dim" />
            </div>
        ))}
    </div>
);

/** The mark that says the sheet is finished, not that loading failed. */
export const Coda = ({ label = 'End of sheet' }) => (
    <div className="flex items-center gap-4 py-12">
        <div aria-hidden="true" className="h-px flex-1 bg-rule" />
        <p className="t-label">{label}</p>
        <div aria-hidden="true" className="h-px flex-1 bg-rule" />
    </div>
);

/**
 * The continuation of a register: the word that fetches the next page, and how
 * much of the whole is on the sheet so far. Never an infinite scroll where a total
 * is known — a result set is something a reader finishes.
 */
export const More = ({ shown, total, isLoading, onMore, label = 'Show more' }) => (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3 border-b border-rule py-8">
        <button type="button" onClick={onMore} disabled={isLoading} className="act act-outline h-11 px-6">
            {isLoading ? 'Fetching…' : label}
        </button>
        <p className="t-readout text-ink-quiet">
            {shown} of {total} shown
        </p>
    </div>
);

/**
 * A position rail of routes — the sub-navigation on the Scrolls, Community, and
 * Search sheets. Same control as the rule builder's `tagMatchType`: sharp stops
 * sharing hairlines, the held stop inverted to solid ink. `NavLink` marks the
 * held one with `aria-current`, which the `.stop` styles read, so nothing here
 * has to look at the location itself.
 */
export const Rail = ({ items, className = '' }) => (
    <nav className={`flex flex-wrap border border-rule ${className}`}>
        {items.map((item) => (
            <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="stop t-label h-11 flex-1 whitespace-nowrap px-5 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-rule"
            >
                {item.label}
            </NavLink>
        ))}
    </nav>
);
