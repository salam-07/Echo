import React from 'react';

/**
 * THE HORIZONTAL DRUM — the running head's register.
 *
 * A sibling to the RuleDrum in the index column, turned on its side and hung in
 * the top margin. Where that one is a vertical counter you wind through a cut
 * window, this is a lateral band: a row of names laid across the head with one
 * standing at its centre — full ink, full size, weight 600 — and its neighbours
 * falling away to either side, each a step smaller and a step lighter, until the
 * outermost dissolve into the paper at the mouth of the band.
 *
 * The recession is built from the world's own materials and one sanctioned
 * exception. Scale and ink-value do the near work: every step out mixes a little
 * more paper into the ink and takes a little off the scale — the same value
 * ladder the rest of the document climbs (ink → ink-soft → ink-quiet →
 * rule-strong), only here it is continuous. The far work — the actual dissolve
 * to nothing at each rim — is a single horizontal mask, the one gradient this
 * flat sheet permits itself, granted to this component alone so the band reads
 * as the mouth of a cylinder without a pixel of blur or a degree of rotation.
 * See `.hdrum` in index.css.
 *
 * This is the static face only: it paints a row and centres a name. Every name
 * shares one face, size, weight and tracking, so that when the turning logic is
 * fitted later a name sliding to the centre will grow and ink without ever
 * changing metrics or stepping sideways. The drag, the throw and the detent that
 * arrests on a whole name are a deliberate later pass and are absent here — this
 * is the shape that logic will move, not the logic.
 */

/* A stand-in strip so the register renders on its own while it is still just a
   face. The real names will be handed in — the held feed at the centre, its
   neighbours to either side — once the drum is wired to the store. */
const SAMPLE = [
    { id: 'following', name: 'Following' },
    { id: 'design', name: 'Design' },
    { id: 'longform', name: 'Longform' },
    { id: 'home', name: 'Home' },
    { id: 'photography', name: 'Photography' },
    { id: 'dispatches', name: 'Dispatches' },
    { id: 'archive', name: 'Archive' },
];

const HorizontalDrum = ({
    items = SAMPLE,
    centerIndex = Math.floor((SAMPLE.length - 1) / 2),
    label = 'Your feeds',
}) => {
    if (items.length === 0) return null;

    /* The held name is what stands in the centre. Clamped because a caller may
       hand in an index past either end; the centring itself — translating the
       band so an arbitrary held name sits under the midpoint — arrives with the
       turning logic, so for now the strip is centred on its own middle. */
    const held = Math.max(0, Math.min(items.length - 1, centerIndex));

    return (
        <div
            className="hdrum"
            role="listbox"
            aria-label={label}
            aria-orientation="horizontal"
        >
            <div className="hdrum-track">
                {items.map((item, position) => {
                    /* One number per name: its distance in steps from the
                       centre. The CSS spends it on scale and on how much paper is
                       mixed into the ink. */
                    const depth = Math.abs(position - held);
                    const isHeld = position === held;

                    return (
                        <div
                            key={item.id}
                            role="option"
                            aria-selected={isHeld}
                            data-held={isHeld || undefined}
                            className="hdrum-item"
                            style={{ '--depth': depth }}
                        >
                            <span className="hdrum-name">{item.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HorizontalDrum;
