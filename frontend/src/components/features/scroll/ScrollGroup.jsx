import React from 'react';
import ScrollCard from './ScrollCard';

/**
 * A titled run of Scroll rows. Every register that lists Scrolls — All, Feeds,
 * Curations — reads the same way: a small-caps heading with its count set
 * opposite, then the rows underneath.
 *
 * A group with no rows prints nothing, not an empty heading, so a reader who
 * follows nothing sees only "Yours" rather than a label with nothing under it.
 */
const ScrollGroup = ({ label, count, items, renderAction, showKind = true }) => {
    if (items.length === 0) return null;

    return (
        <section className="mt-6">
            <div className="flex items-baseline justify-between gap-6 pb-1">
                <h2 className="t-label t-label--ink">{label}</h2>
                <p className="t-readout text-ink-quiet">{count}</p>
            </div>
            {items.map((scroll) => (
                <ScrollCard
                    key={scroll._id}
                    scroll={scroll}
                    showKind={showKind}
                    action={renderAction ? renderAction(scroll) : null}
                />
            ))}
        </section>
    );
};

export default ScrollGroup;
