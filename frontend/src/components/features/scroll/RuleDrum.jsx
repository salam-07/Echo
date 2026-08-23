import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EASE, gsap } from '../../editorial/motion.js';
import { useScrollStore } from '../../../store/useScrollStore';

/**
 * THE RULE DRUM — the index column's one instrument.
 *
 * Every other control in this document is a printed line you press. This is a
 * register you turn, because the rule that governs your feed is the single
 * setting the whole product exists to hand over, and it should not look like a
 * link to Settings sitting one row above a link to Settings.
 *
 * It is a mechanical counter. A hairline frame three rows tall, one row of it
 * inked, and a strip of your rules that rolls behind the cut. Whatever name is
 * standing in the inked window is the rule the home sheet is reading. Turn it by
 * dragging, by arrow key, or by clicking the name you want; it spins, decelerates
 * and arrests on a whole row, never between two.
 *
 * Three things make it read as a machine rather than a list that moves:
 *
 *   THE CUT. Two metrically identical strips move under one transform on one
 *   tick — ink on paper clipped to the frame, paper on ink clipped to the band.
 *   A name crossing the band edge is cut mid-glyph and changes colour halfway
 *   through a letter. No fade, no gradient: a hard edge, like a word passing
 *   under an inked plate. See `.drum` in index.css for why the two layers must
 *   stay metrically identical.
 *
 *   THE TRAVEL. A four-rule jump rolls *through* the three rules between, because
 *   the position is one continuous number and not a swap. The duration grows with
 *   the root of the distance, so a long throw spins faster per row than a short
 *   one, which is what a counter does. Nothing rotates: this world is a flat
 *   sheet with no depth to rotate into, and that is precisely what killed the 3D
 *   wheel that used to stand here. A counter never needed depth. It needed a
 *   window and a detent.
 *
 *   THE GEARING. The readout above is a second, smaller wheel carrying the held
 *   rule's number, driven off the same tick as the big one. It is information —
 *   which of how many — and it is also the tell that these are wheels.
 *
 * Nothing about the position lives in React state while it is moving. The tween
 * writes `transform` to three elements and nothing else, all of them promoted at
 * mount, so a roll is compositor work start to finish and there is no layout,
 * paint or render on any frame of it. React hears about the choice once, when the
 * drum has stopped.
 *
 * Which is also the interaction rule: turning is free, *committing* happens on
 * arrest. The home sheet refetches on every change of held rule, so a drum that
 * committed per row would fire a request per row of a throw. You spin the
 * register; it registers when it stops. A real one does the same.
 *
 * The wheel event is deliberately not bound. This is a 132px target inside a
 * 248px column that the page scrolls behind, and a drum that ate the scroll
 * wheel would trap the reader every time they scrolled with the cursor resting
 * over it. Dragging says what it means; scrolling does not.
 */

/* How far a flick is projected past the finger, and how much of the roll is
   still travelling when the throw is long. Both tuned by hand against the sheet;
   the ease is the world's own. */
const PROJECTION_MS = 130;
const BASE_DURATION = 0.26;
const DURATION_PER_ROOT_ROW = 0.12;
const MAX_DURATION = 0.8;

/* Past the last rule the drum still gives, but only just, and it always comes
   back. Resistance is what tells a hand it has reached the end of the strip. */
const OVERRUN_ROWS = 0.55;

const clamp = (value, max) => Math.max(0, Math.min(max, value));

const isCalm = () =>
    document.documentElement.dataset.motion === 'reduce' ||
    (typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

const RuleDrum = ({ onNavigate }) => {
    const { scrolls, selectedScroll, setSelectedScroll, getScrolls, isLoadingScrolls } =
        useScrollStore();

    const feeds = useMemo(() => scrolls.filter((scroll) => scroll.type === 'feed'), [scrolls]);
    const count = feeds.length;
    const rows = count === 1 ? 1 : 3;
    const bandIndex = rows === 1 ? 0 : 1;

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    /* Where the store stands. The drum may lead this by one roll. */
    const heldIndex = useMemo(() => {
        const found = feeds.findIndex((feed) => feed._id === selectedScroll?._id);
        return found < 0 ? 0 : found;
    }, [feeds, selectedScroll?._id]);

    /* `index` is what the drum is pointing at — the only piece of this the
       renderer needs, and it changes once per choice rather than once per frame. */
    const [index, setIndex] = useState(heldIndex);
    const [turning, setTurning] = useState(false);

    const drumRef = useRef(null);
    const stripRef = useRef(null);
    const invertedRef = useRef(null);
    const bandRef = useRef(null);
    const countWindowRef = useRef(null);
    const countStripRef = useRef(null);

    /* The visual position, in rows, as a float. Held in a ref because it moves
       sixty times a second and React must not hear about any of it. */
    const positionRef = useRef(heldIndex);
    const intentRef = useRef(heldIndex);
    const tweenRef = useRef(null);

    /* Row heights are measured, never assumed. `--drum-row` is 2.75rem, and a
       reader who has set a 20px root font — or zoomed — has rows that are not
       44px. Hard-coding the number would misalign the whole register for exactly
       the people most likely to need it aligned. */
    const rowRef = useRef(44);
    const digitRef = useRef(16);

    /* Latest-value mirrors, so the pointer and key handlers can stay stable
       across renders and still see the current list. */
    const feedsRef = useRef(feeds);
    const navigateRef = useRef(onNavigate);
    feedsRef.current = feeds;
    navigateRef.current = onNavigate;

    /* --- Writing the position ------------------------------------------------ */

    /* The whole render loop: three transform writes, no reads. Called from the
       tween's onUpdate and from the drag directly. */
    const paint = useCallback(
        (position) => {
            const offset = `translate3d(0,${-(position - bandIndex) * rowRef.current}px,0)`;
            if (stripRef.current) stripRef.current.style.transform = offset;
            if (invertedRef.current) invertedRef.current.style.transform = offset;
            if (countStripRef.current) {
                countStripRef.current.style.transform = `translate3d(0,${
                    -position * digitRef.current
                }px,0)`;
            }
        },
        [bandIndex],
    );

    /* Measure, then paint. Run on mount, on every change to the strip, and
       whenever the column is resized under it. */
    const measure = useCallback(() => {
        if (bandRef.current) rowRef.current = bandRef.current.getBoundingClientRect().height || 44;
        if (countWindowRef.current) {
            digitRef.current = countWindowRef.current.getBoundingClientRect().height || 16;
        }
        paint(positionRef.current);
    }, [paint]);

    useLayoutEffect(() => {
        measure();
        const drum = drumRef.current;
        if (!drum || typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(measure);
        observer.observe(drum);
        return () => observer.disconnect();
    }, [measure, count]);

    /* --- Committing --------------------------------------------------------- */

    /* Idempotent on purpose: the drum arrests on a rule it is already holding
       often — a tap on the band, a flick that comes back — and none of those
       should push the home sheet into refetching. */
    const commit = useCallback(
        (target, close) => {
            const feed = feedsRef.current[target];
            if (feed && useScrollStore.getState().selectedScroll?._id !== feed._id) {
                setSelectedScroll(feed);
            }
            if (close) navigateRef.current?.();
        },
        [setSelectedScroll],
    );

    /* --- Turning ------------------------------------------------------------ */

    const roll = useCallback(
        (target, { close = false, immediate = false } = {}) => {
            tweenRef.current?.kill();
            tweenRef.current = null;

            const from = positionRef.current;
            const distance = Math.abs(target - from);

            if (immediate || distance < 0.001 || isCalm()) {
                positionRef.current = target;
                paint(target);
                commit(target, close);
                return;
            }

            const carriage = { position: from };
            tweenRef.current = gsap.to(carriage, {
                position: target,
                duration: Math.min(
                    MAX_DURATION,
                    BASE_DURATION + DURATION_PER_ROOT_ROW * Math.sqrt(distance),
                ),
                ease: EASE,
                onUpdate: () => {
                    positionRef.current = carriage.position;
                    paint(carriage.position);
                },
                onComplete: () => {
                    tweenRef.current = null;
                    commit(target, close);
                },
            });
        },
        [commit, paint],
    );

    /* The one entry point for anything the reader does. */
    const turn = useCallback(
        (to, { close = false } = {}) => {
            const target = clamp(Math.round(to), feedsRef.current.length - 1);
            intentRef.current = target;
            setIndex(target);
            roll(target, { close });
        },
        [roll],
    );

    /* The store moving underneath the drum: a rule restored from the last visit,
       a held rule deleted, a selection made somewhere else. The first of these is
       not animated — a register should be found already set, not caught winding
       itself up on arrival. */
    const arrivedRef = useRef(false);
    useEffect(() => {
        if (count === 0) return;
        if (!arrivedRef.current) {
            arrivedRef.current = true;
            intentRef.current = heldIndex;
            setIndex(heldIndex);
            positionRef.current = heldIndex;
            /* Commits `feeds[0]` when nothing was held, which is how the home
               sheet always has a rule to read. */
            roll(heldIndex, { immediate: true });
            return;
        }
        if (heldIndex !== intentRef.current) {
            intentRef.current = heldIndex;
            setIndex(heldIndex);
            roll(heldIndex);
        }
    }, [heldIndex, count, roll]);

    /* A roll interrupted by unmount still counts. The mobile contents sheet is
       closed by the same tap that turns the drum, so without this the choice
       would be thrown away exactly when it was most deliberate. */
    useEffect(
        () => () => {
            tweenRef.current?.kill();
            commit(intentRef.current, false);
        },
        [commit],
    );

    /* --- The hand ----------------------------------------------------------- */

    const dragRef = useRef(null);
    const movedRef = useRef(false);

    const onPointerDown = useCallback(
        (event) => {
            if (event.button !== 0 || feedsRef.current.length < 2) return;
            tweenRef.current?.kill();
            tweenRef.current = null;
            movedRef.current = false;
            dragRef.current = {
                id: event.pointerId,
                y: event.clientY,
                from: positionRef.current,
                samples: [{ t: event.timeStamp, p: positionRef.current }],
            };
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setTurning(true);
        },
        [],
    );

    const onPointerMove = useCallback(
        (event) => {
            const drag = dragRef.current;
            if (!drag || drag.id !== event.pointerId) return;

            const travelled = event.clientY - drag.y;
            if (Math.abs(travelled) > 3) movedRef.current = true;

            const max = feedsRef.current.length - 1;
            const raw = drag.from - travelled / rowRef.current;

            /* Past either end the strip still gives, sub-linearly and by less
               than a row, so the hand is told where the strip stops without the
               drum ever showing blank paper in its window. */
            let position = raw;
            if (raw < 0) position = -Math.min(OVERRUN_ROWS, (-raw) ** 0.7 * 0.42);
            else if (raw > max) position = max + Math.min(OVERRUN_ROWS, (raw - max) ** 0.7 * 0.42);

            positionRef.current = position;
            paint(position);

            drag.samples.push({ t: event.timeStamp, p: position });
            if (drag.samples.length > 6) drag.samples.shift();
        },
        [paint],
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
               carries through several rules and a slow drag does not. */
            const samples = drag.samples;
            const last = samples[samples.length - 1];
            const first = samples.find((sample) => last.t - sample.t < 90) ?? samples[0];
            const elapsed = last.t - first.t;
            const velocity = elapsed > 0 ? (last.p - first.p) / elapsed : 0;

            turn(clamp(last.p + velocity * PROJECTION_MS, feedsRef.current.length - 1), {
                close: true,
            });
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

    /* Which row of the frame was clicked, resolved against the drum's own box
       rather than by a handler per row — the inked band sits over the strip, so
       the middle row's own element is never the thing the pointer reaches. */
    const onClick = useCallback(
        (event) => {
            if (movedRef.current) return;
            const drum = drumRef.current;
            if (!drum) return;
            const offset = event.clientY - drum.getBoundingClientRect().top;
            const row = Math.floor(offset / rowRef.current);
            turn(Math.round(positionRef.current) + (row - bandIndex), { close: true });
        },
        [bandIndex, turn],
    );

    const onKeyDown = useCallback(
        (event) => {
            const max = feedsRef.current.length - 1;
            const step = (delta) => {
                event.preventDefault();
                turn(intentRef.current + delta);
            };

            switch (event.key) {
                case 'ArrowDown':
                    return step(1);
                case 'ArrowUp':
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
                    return turn(max);
                case 'Enter':
                case ' ':
                    /* Arrowing does not close the contents sheet, so this is how a
                       keyboard says it is finished with the register. */
                    event.preventDefault();
                    return turn(intentRef.current, { close: true });
                case 'Escape':
                    /* Wound somewhere by accident: back to the rule the sheet is
                       actually reading. */
                    event.preventDefault();
                    return turn(heldIndex);
                default:
                    return undefined;
            }
        },
        [heldIndex, turn],
    );

    /* --- States ------------------------------------------------------------- */

    /* Both of these keep the frame, so the register never appears by pushing the
       rest of the index column down the page. */
    if (isLoadingScrolls && count === 0) {
        return (
            <Register>
                <div aria-hidden="true" className="drum">
                    <div className="drum-strip animate-pulse">
                        {[0, 1, 2].map((row) => (
                            <div key={row} className="drum-row">
                                <span
                                    className="block h-[0.4375rem] bg-paper-dim"
                                    style={{ width: `${68 - row * 16}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="drum-band" />
                </div>
            </Register>
        );
    }

    if (count === 0) {
        return (
            <Register>
                <div className="border-y border-rule px-3 py-3.5">
                    <p className="text-[0.8125rem] leading-[1.5] text-ink-quiet">
                        Nothing written yet. The drum turns once you have a rule to put in it.
                    </p>
                    <Link
                        to="/scroll/new"
                        onClick={onNavigate}
                        className="t-label link-rule mt-2 inline-block text-ink"
                    >
                        Write one
                    </Link>
                </div>
            </Register>
        );
    }

    const activeId = feeds[index] ? `rule-${feeds[index]._id}` : undefined;

    return (
        <Register
            readout={
                <span className="t-readout flex items-center text-ink-quiet">
                    <span ref={countWindowRef} className="drum-count">
                        <span ref={countStripRef} className="block">
                            {feeds.map((feed, position) => (
                                <span key={feed._id} className="drum-count-row block">
                                    {String(position + 1).padStart(2, '0')}
                                </span>
                            ))}
                        </span>
                    </span>
                    <span className="text-rule-strong">/{String(count).padStart(2, '0')}</span>
                </span>
            }
        >
            <div
                ref={drumRef}
                className="drum"
                data-rows={rows}
                data-turning={turning || undefined}
                role="listbox"
                tabIndex={0}
                aria-label="Rule governing your feed"
                aria-activedescendant={activeId}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                onClick={onClick}
                onKeyDown={onKeyDown}
            >
                {/* Ink on paper, clipped to the frame. This layer carries the
                    semantics; its twin is decoration over the top of it. */}
                <div ref={stripRef} className="drum-strip" role="presentation">
                    {feeds.map((feed, position) => (
                        <div
                            key={feed._id}
                            id={`rule-${feed._id}`}
                            role="option"
                            aria-selected={position === index}
                            className="drum-row"
                        >
                            <span className="drum-name">{feed.name}</span>
                        </div>
                    ))}
                </div>

                {/* Paper on ink, clipped to the band. Same markup, same metrics,
                    same transform — only the ground and the ink swap. */}
                <div ref={bandRef} className="drum-band" aria-hidden="true">
                    <div ref={invertedRef} className="drum-strip drum-strip--inverted">
                        {feeds.map((feed) => (
                            <div key={feed._id} className="drum-row">
                                <span className="drum-name">{feed.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Register>
    );
};

/**
 * The register's own frame: what it is called, where it stands, and where the
 * rest of them are filed. Shared by all three states so the head and the
 * footnote never move when the drum below them changes what it is.
 */
const Register = ({ readout, children }) => (
    <div>
        <div className="flex items-center justify-between gap-3 px-3 pb-2">
            <p className="t-label">Your rules</p>
            {readout}
        </div>
        {children}
        <div className="flex justify-end px-3 pt-2">
            <Link to="/scrolls/feeds" className="t-label link-rule transition-colors hover:text-ink">
                All rules
            </Link>
        </div>
    </div>
);

export default RuleDrum;
