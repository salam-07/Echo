import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EASE, gsap } from '../../editorial/motion.js';

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
 * Turning it is the RuleDrum's mechanism laid on its side: drag it, flick it, key
 * it, or click a name, and the strip slides until a whole name arrests under the
 * midpoint — never between two. The one number each name already carries, its
 * distance from the centre, is recomputed every frame while it moves, so a name
 * gliding inward grows and inks continuously the way the static face only hinted
 * it would; nothing changes face, weight or tracking as it travels, it only comes
 * up out of the paper. A flick is projected past the finger and a long throw rolls
 * *through* the names between, because the position is one continuous number.
 *
 * The vertical drum could turn pixels into rows with a single multiply — every
 * row is one measured height. Names are not so obliging: they have unequal
 * widths, so this drum measures the centre of each one and interpolates between
 * them, forward to place the strip and inverse to read a drag back into a
 * position. That measuring is the only real weight the sideways turn adds.
 *
 * Nothing about the position lives in React state while it is moving. The tween
 * writes `transform` to the track and `--depth` to the names, and React hears
 * about the choice once, on arrest — `onChange(index, item)` fires when the drum
 * stops, not per name of a throw. You spin the register; it registers when it
 * stops.
 */

/* How far a flick is projected past the finger, and how much of the roll is
   still travelling when the throw is long — the RuleDrum's own numbers, and its
   ease, so the two registers turn with one hand. */
const PROJECTION_MS = 130;
const BASE_DURATION = 0.26;
const DURATION_PER_ROOT_STEP = 0.12;
const MAX_DURATION = 0.8;

/* Past the last name the drum still gives, but only just, and it always comes
   back. Resistance is what tells a hand it has reached the end of the strip. */
const OVERRUN_STEPS = 0.55;

const clamp = (value, max) => Math.max(0, Math.min(max, value));

const isCalm = () =>
    document.documentElement.dataset.motion === 'reduce' ||
    (typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* A stand-in strip so the register turns on its own while no feeds are handed in.
   A caller wires it to the store by passing `items` and committing in `onChange`. */
const SAMPLE = [
    { id: 'following', name: 'Following' },
    { id: 'design', name: 'Design' },
    { id: 'longform', name: 'Longform' },
    { id: 'home', name: 'Home' },
    { id: 'photography', name: 'Photography' },
    { id: 'dispatches', name: 'Dispatches' },
    { id: 'archive', name: 'Archive' },
];

const HorizontalDrum = ({ items = SAMPLE, centerIndex, label = 'Your feeds', onChange }) => {
    const count = items.length;
    const max = Math.max(0, count - 1);

    /* The name the caller wants standing at the centre. Doubles as the initial
       position and, if the caller drives it, the one to roll to when it changes —
       the same role `heldIndex` plays in the RuleDrum, only handed in rather than
       read from the store. Defaults to the middle of the strip. */
    const heldIndex = clamp(centerIndex ?? Math.floor(max / 2), max);

    /* `index` is what the drum points at — the only piece the renderer needs, and
       it changes once per choice rather than once per frame. */
    const [index, setIndex] = useState(heldIndex);
    const [turning, setTurning] = useState(false);

    const drumRef = useRef(null);
    const trackRef = useRef(null);

    /* The visual position, in name-steps, as a float — moved sixty times a second
       in a ref so React never hears about a single frame of it. */
    const positionRef = useRef(heldIndex);
    const intentRef = useRef(heldIndex);
    const committedRef = useRef(heldIndex);
    const tweenRef = useRef(null);

    /* Names have unequal widths, so a position is not a pixel offset until it is
       measured. `centers` is each name's centre in the drum's own box (transforms
       ignored, so a scaled neighbour still reports its true seat); `mid` is the
       midpoint the held name is brought to. `heldPainted` is which name currently
       wears the centre's ink, tracked so we touch the DOM only when it changes. */
    const centersRef = useRef([]);
    const midRef = useRef(0);
    const heldPaintedRef = useRef(-1);

    /* Latest-value mirrors so the pointer and key handlers stay stable across
       renders and still see the current strip. */
    const itemsRef = useRef(items);
    const onChangeRef = useRef(onChange);
    itemsRef.current = items;
    onChangeRef.current = onChange;

    /* --- Reading the ruler --------------------------------------------------- */

    /* Forward: a float position → the content-x of that point, interpolated
       between the two names it falls between, extrapolated past either end with
       the end pitch so the overrun has somewhere to go. */
    const centerForPosition = useCallback((p) => {
        const c = centersRef.current;
        const n = c.length;
        if (n === 0) return 0;
        if (n === 1) return c[0];
        if (p <= 0) return c[0] + p * (c[1] - c[0]);
        if (p >= n - 1) return c[n - 1] + (p - (n - 1)) * (c[n - 1] - c[n - 2]);
        const i = Math.floor(p);
        return c[i] + (p - i) * (c[i + 1] - c[i]);
    }, []);

    /* Inverse: a content-x → the float position sitting there. The drag reads in
       pixels and must think in names; this is how it crosses over. Returns raw,
       unclamped values past the ends so the caller can apply the overrun give. */
    const positionForCenter = useCallback((cx) => {
        const c = centersRef.current;
        const n = c.length;
        if (n < 2) return 0;
        if (cx <= c[0]) return (cx - c[0]) / (c[1] - c[0] || 1);
        if (cx >= c[n - 1]) return n - 1 + (cx - c[n - 1]) / (c[n - 1] - c[n - 2] || 1);
        let i = 0;
        while (i < n - 1 && c[i + 1] < cx) i += 1;
        return i + (cx - c[i]) / (c[i + 1] - c[i] || 1);
    }, []);

    /* --- Writing the position ------------------------------------------------ */

    /* The whole render loop: one transform on the track, one `--depth` per name,
       and the centre's ink moved when — and only when — the held name changes.
       No React, no layout reads. `--depth` is spent by the CSS on scale and on how
       much paper is mixed into the ink; the CSS floors both a few steps out, so
       the far names cost nothing to keep writing. */
    const paint = useCallback(
        (p) => {
            const track = trackRef.current;
            if (!track) return;

            track.style.transform = `translate3d(${midRef.current - centerForPosition(p)}px,0,0)`;

            const names = track.children;
            const n = names.length;
            for (let i = 0; i < n; i += 1) {
                names[i].style.setProperty('--depth', String(Math.abs(i - p)));
            }

            if (n > 0) {
                const near = clamp(Math.round(p), n - 1);
                if (near !== heldPaintedRef.current) {
                    names[heldPaintedRef.current]?.removeAttribute('data-held');
                    names[near]?.setAttribute('data-held', '');
                    heldPaintedRef.current = near;
                }
            }
        },
        [centerForPosition],
    );

    /* Measure, then paint. Names carry the drum's width, so this re-runs whenever
       the strip, the column or the fonts change under it — a hard-coded pitch
       would misalign the whole register the moment a name was longer than assumed
       or a web font swapped in late. */
    const measure = useCallback(() => {
        const drum = drumRef.current;
        const track = trackRef.current;
        if (!drum || !track) return;
        midRef.current = drum.clientWidth / 2;
        const names = track.children;
        const centers = new Array(names.length);
        for (let i = 0; i < names.length; i += 1) {
            centers[i] = names[i].offsetLeft + names[i].offsetWidth / 2;
        }
        centersRef.current = centers;
        paint(positionRef.current);
    }, [paint]);

    useLayoutEffect(() => {
        measure();
        const drum = drumRef.current;
        const track = trackRef.current;
        if (typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(measure);
        if (drum) observer.observe(drum);
        if (track) observer.observe(track);
        let cancelled = false;
        /* Fonts land after first layout and change every name's width; re-measure
           once they do, or the strip sits a few pixels off its seats. */
        document.fonts?.ready.then(() => {
            if (!cancelled) measure();
        });
        return () => {
            cancelled = true;
            observer.disconnect();
        };
    }, [measure, count]);

    /* --- Committing --------------------------------------------------------- */

    /* Idempotent on purpose: the drum arrests on a name it is already holding
       often — a tap on the centre, a flick that comes back, a caller-driven
       sync — and none of those should echo back out through `onChange`. */
    const commit = useCallback((target) => {
        const item = itemsRef.current[target];
        if (item && committedRef.current !== target) {
            committedRef.current = target;
            onChangeRef.current?.(target, item);
        }
    }, []);

    /* --- Turning ------------------------------------------------------------ */

    const roll = useCallback(
        (target, { immediate = false } = {}) => {
            tweenRef.current?.kill();
            tweenRef.current = null;

            const from = positionRef.current;
            const distance = Math.abs(target - from);

            if (immediate || distance < 0.001 || isCalm()) {
                positionRef.current = target;
                paint(target);
                commit(target);
                return;
            }

            const carriage = { position: from };
            tweenRef.current = gsap.to(carriage, {
                position: target,
                duration: Math.min(
                    MAX_DURATION,
                    BASE_DURATION + DURATION_PER_ROOT_STEP * Math.sqrt(distance),
                ),
                ease: EASE,
                onUpdate: () => {
                    positionRef.current = carriage.position;
                    paint(carriage.position);
                },
                onComplete: () => {
                    tweenRef.current = null;
                    commit(target);
                },
            });
        },
        [commit, paint],
    );

    /* The one entry point for anything the reader does. */
    const turn = useCallback(
        (to) => {
            const target = clamp(Math.round(to), itemsRef.current.length - 1);
            intentRef.current = target;
            setIndex(target);
            roll(target);
        },
        [roll],
    );

    /* The caller moving the drum underneath itself: a feed handed in on arrival, or
       the centre driven from outside. The first is not animated — a register should
       be found already set. Neither echoes `onChange`; both pre-set `committed` so
       the commit at the end of the roll is a no-op. */
    const arrivedRef = useRef(false);
    useEffect(() => {
        if (count === 0) return;
        if (!arrivedRef.current) {
            arrivedRef.current = true;
            intentRef.current = heldIndex;
            committedRef.current = heldIndex;
            setIndex(heldIndex);
            positionRef.current = heldIndex;
            roll(heldIndex, { immediate: true });
            return;
        }
        if (heldIndex !== intentRef.current) {
            intentRef.current = heldIndex;
            committedRef.current = heldIndex;
            setIndex(heldIndex);
            roll(heldIndex);
        }
    }, [heldIndex, count, roll]);

    useEffect(
        () => () => {
            tweenRef.current?.kill();
        },
        [],
    );

    /* --- The hand ----------------------------------------------------------- */

    const dragRef = useRef(null);
    const movedRef = useRef(false);

    const onPointerDown = useCallback(
        (event) => {
            if (event.button !== 0 || itemsRef.current.length < 2) return;
            tweenRef.current?.kill();
            tweenRef.current = null;
            movedRef.current = false;
            dragRef.current = {
                id: event.pointerId,
                x: event.clientX,
                /* The content-x under the midpoint at grab: the drag moves this by
                   the finger's travel, then reads it back into a position. */
                center: centerForPosition(positionRef.current),
                samples: [{ t: event.timeStamp, p: positionRef.current }],
            };
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setTurning(true);
        },
        [centerForPosition],
    );

    const onPointerMove = useCallback(
        (event) => {
            const drag = dragRef.current;
            if (!drag || drag.id !== event.pointerId) return;

            const travelled = event.clientX - drag.x;
            if (Math.abs(travelled) > 3) movedRef.current = true;

            const limit = itemsRef.current.length - 1;
            const raw = positionForCenter(drag.center - travelled);

            /* Past either end the strip still gives, sub-linearly and by less than
               a name, so the hand is told where the strip stops without the drum
               ever showing blank paper at its centre. */
            let position = raw;
            if (raw < 0) position = -Math.min(OVERRUN_STEPS, (-raw) ** 0.7 * 0.42);
            else if (raw > limit) {
                position = limit + Math.min(OVERRUN_STEPS, (raw - limit) ** 0.7 * 0.42);
            }

            positionRef.current = position;
            paint(position);

            drag.samples.push({ t: event.timeStamp, p: position });
            if (drag.samples.length > 6) drag.samples.shift();
        },
        [paint, positionForCenter],
    );

    const onPointerUp = useCallback(
        (event) => {
            const drag = dragRef.current;
            if (!drag || drag.id !== event.pointerId) return;
            dragRef.current = null;
            setTurning(false);
            event.currentTarget.releasePointerCapture?.(event.pointerId);

            if (!movedRef.current) return; /* a click, not a throw — see onClick */

            /* Velocity over the tail of the gesture, projected forward, so a flick
               carries through several names and a slow drag does not. */
            const { samples } = drag;
            const last = samples[samples.length - 1];
            const first = samples.find((sample) => last.t - sample.t < 90) ?? samples[0];
            const elapsed = last.t - first.t;
            const velocity = elapsed > 0 ? (last.p - first.p) / elapsed : 0;

            turn(clamp(last.p + velocity * PROJECTION_MS, itemsRef.current.length - 1));
        },
        [turn],
    );

    const onPointerCancel = useCallback(
        (event) => {
            if (!dragRef.current || dragRef.current.id !== event.pointerId) return;
            dragRef.current = null;
            setTurning(false);
            roll(intentRef.current);
        },
        [roll],
    );

    /* A click selects the name under the finger. Scaled-down neighbours leave gaps
       the pointer can fall through, so when it lands between names we take the
       nearest seat instead — resolved against the same measured centres, shifted
       by the strip's current travel. */
    const onClick = useCallback(
        (event) => {
            if (movedRef.current) return;
            const track = trackRef.current;
            const drum = drumRef.current;
            if (!track || !drum) return;

            const hit = event.target.closest?.('.hdrum-item');
            if (hit) {
                const idx = Array.prototype.indexOf.call(track.children, hit);
                if (idx >= 0) {
                    turn(idx);
                    return;
                }
            }

            const centers = centersRef.current;
            if (!centers.length) return;
            const travel = midRef.current - centerForPosition(positionRef.current);
            const contentX = event.clientX - drum.getBoundingClientRect().left - travel;
            let nearest = 0;
            let best = Infinity;
            for (let i = 0; i < centers.length; i += 1) {
                const d = Math.abs(centers[i] - contentX);
                if (d < best) {
                    best = d;
                    nearest = i;
                }
            }
            turn(nearest);
        },
        [centerForPosition, turn],
    );

    const onKeyDown = useCallback(
        (event) => {
            const limit = itemsRef.current.length - 1;
            const step = (delta) => {
                event.preventDefault();
                turn(intentRef.current + delta);
            };

            switch (event.key) {
                case 'ArrowRight':
                    return step(1);
                case 'ArrowLeft':
                    return step(-1);
                case 'PageDown':
                    return step(3);
                case 'PageUp':
                    return step(-3);
                case 'Home':
                    event.preventDefault();
                    return turn(0);
                case 'End':
                    event.preventDefault();
                    return turn(limit);
                case 'Escape':
                    /* Wound somewhere by accident: back to the name the drum last
                       committed to. */
                    event.preventDefault();
                    return turn(committedRef.current);
                default:
                    return undefined;
            }
        },
        [turn],
    );

    if (count === 0) return null;

    const activeItem = items[index];
    const activeId = activeItem ? `hdrum-${activeItem.id ?? index}` : undefined;

    return (
        <div
            ref={drumRef}
            className="hdrum"
            data-turning={turning || undefined}
            data-static={count < 2 || undefined}
            role="listbox"
            tabIndex={0}
            aria-label={label}
            aria-orientation="horizontal"
            aria-activedescendant={activeId}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            {/* One strip, translated as a whole. `--depth` and the centre's ink are
                written straight to these nodes by `paint`, never by React, so a
                render never fights a frame of the roll. */}
            <div ref={trackRef} className="hdrum-track">
                {items.map((item, position) => (
                    <div
                        key={item.id ?? position}
                        id={`hdrum-${item.id ?? position}`}
                        role="option"
                        aria-selected={position === index}
                        className="hdrum-item"
                    >
                        <span className="hdrum-name">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HorizontalDrum;
