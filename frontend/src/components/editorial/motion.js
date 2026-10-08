import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

/**
 * The motion system for ECHO-EDIT-01.
 *
 * This world is a printed sheet, so nothing on it floats, blurs or parallaxes.
 * It is *set*. There are four verbs, all borrowed from the press:
 *
 *   STRIKE     — a rule is drawn across the sheet, left to right. Every hairline
 *                arrives this way, and the three rules that measure something are
 *                drawn by the reader's own scroll rather than by a clock.
 *   SET        — a line of type rises onto its baseline from under a mask, the way
 *                a line of metal drops into the stick. Reserved for statements.
 *   INK        — apparatus takes ink: field names, readouts, table rows, controls.
 *                The smallest lift the eye can register, then presence.
 *   IMPRESSION — a sheet already on the press is re-set with new type. The app's
 *                own verb, and the one place the world permits overshoot: a Feed
 *                is something the reader presses, repeatedly, and the hundredth
 *                turn has to be as good as the first.
 *
 * Slowness is the point. Paper does not snap, and a sheet that assembles itself
 * in front of you is the argument the page is making about legibility.
 *
 * Two rules hold across the whole page. Every reveal fires `once`: a sheet is
 * set a single time, and replaying it on the way back up is the tell that
 * separates motion-as-language from motion-as-effect. And every reveal is a
 * `from()`, so the painted state is the default and a script that never runs
 * leaves a complete, readable document.
 */

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/* Mobile browsers fire resize as the URL bar collapses. Left on, that restarts
   every scrubbed rule mid-draw. */
ScrollTrigger.config({ ignoreMobileResize: true });

/** Confident arrival, no overshoot. The one easing curve this world uses. */
export const EASE = 'expo.out';

/** Where a section's own motion begins: just before its head clears the fold. */
export const ENTER = 'top 82%';

export const REDUCED = '(prefers-reduced-motion: reduce)';
export const FULL = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger, SplitText, useGSAP };

/**
 * One cue, shared by everything in a section: same element, same threshold, one
 * pass only. Called per tween rather than held in a variable, because each tween
 * gets its own ScrollTrigger and they must not share a vars object. Sequence
 * within a cue with `delay` — the offsets read as a timeline because they are one.
 */
export const enter = (trigger, start = ENTER) => ({ trigger, start, once: true });

/* -- STRIKE ---------------------------------------------------------------- */

/** A rule drawn across the sheet. */
export const strike = (targets, { duration = 1, stagger = 0, delay = 0, scrollTrigger } = {}) =>
    gsap.from(targets, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration,
        stagger,
        delay,
        ease: EASE,
        scrollTrigger,
    });

/**
 * A rule the reader draws themselves — the one scrubbed verb.
 *
 * Used only where the length of the line means something: the document-progress
 * mark under the running head, and the column rules, whose length is how far
 * down the column beside them you have got. A scrub that measures nothing is
 * decoration, and this sheet has none.
 */
export const drawRule = (
    target,
    trigger,
    { start = 'top 85%', end = 'bottom 65%', scrub = 1.1, axis = 'y' } = {},
) => {
    const prop = axis === 'y' ? 'scaleY' : 'scaleX';
    return gsap.fromTo(
        target,
        { [prop]: 0 },
        {
            [prop]: 1,
            transformOrigin: axis === 'y' ? 'top center' : 'left center',
            ease: 'none',
            scrollTrigger: { trigger, start, end, scrub },
        },
    );
};

/* -- SET ------------------------------------------------------------------- */

/**
 * Type rising onto its baseline from under the mask.
 *
 * The split is made as late as possible and thrown away as early as possible:
 * built the moment the section is reached, reverted the moment the last line
 * lands. A line box that outlives its reveal clips its own text the next time the
 * viewport changes width, so the heading spends all of its readable life as
 * ordinary wrapped text and none of it as spans.
 *
 *   `trigger` — hold the element, then set it when that element is reached.
 *   `gate`    — hold the element until the faces it uses are loaded, then set it.
 *               A line that reflows inside its own mask looks broken, and the
 *               cover is the one place a font still in flight could cause it.
 *
 * Either way the element is hidden synchronously, so there is never a flash of
 * already-set type that then drops back under the mask.
 */
export const setLines = (
    target,
    { root, trigger, start = ENTER, duration = 1.15, stagger = 0.14, delay = 0, gate = false } = {},
) => {
    const el = typeof target === 'string' ? (root ?? document).querySelector(target) : target;
    if (!el) return { revert: () => {} };

    const deferred = Boolean(trigger || gate);
    let split = null;
    let tween = null;
    let observer = null;
    let cancelled = false;

    const run = () => {
        if (cancelled) return;
        if (deferred) gsap.set(el, { clearProps: 'opacity' });
        split = SplitText.create(el, { type: 'lines', mask: 'lines', aria: 'auto' });
        tween = gsap.from(split.lines, {
            yPercent: 118,
            duration,
            stagger,
            delay,
            ease: EASE,
            onComplete: () => {
                const before = document.body.offsetHeight;
                split?.revert();
                split = null;
                /* Reverting restores the original wrapped text, which should take
                   exactly the height it did before — refresh only on the rare
                   occasion it does not, so a scrubbed rule is never jogged for
                   nothing. */
                if (document.body.offsetHeight !== before) ScrollTrigger.refresh();
            },
        });
    };

    if (deferred) gsap.set(el, { opacity: 0 });

    if (gate) {
        /* Wait for the faces this element actually uses, not for every font the
           document happens to want, and wait long enough for the answer to be
           real. A split measures line breaks and freezes them into the mask, so
           running it against fallback metrics bakes the wrong breaks in and the
           heading visibly re-breaks the moment the true face lands.
           `document.fonts.ready` alone is too weak a promise to hang this on and
           700ms was too short a ceiling; the ceiling here matches the `block`
           period the stylesheet asks for, because if a face genuinely never
           arrives the text was going to be invisible for that long anyway. Timing
           out is then self-consistent rather than merely early: we set the type
           against the same metrics the reader will actually be reading. */
        const cs = getComputedStyle(el);
        const faces = document.fonts
            ? Promise.all([
                  /* The face this element is actually set in — the one whose
                     metrics decide where the lines break. */
                  document.fonts.load(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`),
                  /* And every other pending face, because a split is a measurement
                     of the whole document and anything still arriving can move the
                     element before it is taken. Either alone is too weak: `load`
                     resolves while the rest of the page is still fetching, `ready`
                     does not guarantee this element's own face at all. */
                  document.fonts.ready,
              ]).catch(() => {})
            : Promise.resolve();
        Promise.race([faces, new Promise((resolve) => setTimeout(resolve, 3000))]).then(run);
    } else if (trigger) {
        observer = ScrollTrigger.create({ trigger, start, once: true, onEnter: run });
    } else {
        run();
    }

    return {
        revert: () => {
            cancelled = true;
            observer?.kill();
            /* The reveal is built inside a callback, so the enclosing context
               never recorded it — it has to be killed by hand. */
            tween?.kill();
            split?.revert();
            gsap.set(el, { clearProps: 'opacity' });
        },
    };
};

/* -- INK ------------------------------------------------------------------- */

/**
 * Apparatus taking ink. Opacity rather than autoAlpha on purpose: an unrevealed
 * heading or field name still has to exist for a screen reader.
 *
 * `clearProps` is for targets that a CSS transition or a hand-rolled FLIP takes
 * over afterwards: it hands the element back with no inline styles at all, so
 * only one system is ever writing to a given property.
 */
export const ink = (
    targets,
    { duration = 0.85, stagger = 0.05, y = 10, delay = 0, scrollTrigger, clearProps } = {},
) =>
    gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        stagger,
        delay,
        ease: EASE,
        scrollTrigger,
        clearProps,
    });

/** The reduced-motion counterpart: the same arrival, without the travel. */
export const inkOnly = (
    targets,
    { duration = 0.45, stagger = 0.03, delay = 0, scrollTrigger } = {},
) => gsap.from(targets, { opacity: 0, duration, stagger, delay, ease: 'power1.out', scrollTrigger });

/* -- IMPRESSION ------------------------------------------------------------ */

/**
 * The feed's own verb — the only one that is a *change* rather than an arrival.
 *
 * STRIKE, SET and INK describe a sheet being made. They run once, on the way
 * down a page, and then the page is simply there. A Feed is the one surface the
 * reader keeps working: the drum in the running head arrests on a new rule and
 * the same sheet is re-impressed with different type, over and over. That is a
 * press taking a fresh impression, and because it is the one motion in the
 * product that repeats, it is the one that has to stay pleasant on the
 * hundredth turn rather than merely work on the first.
 *
 * It is also the single place this world permits overshoot. Everything on the
 * landing sheet lands on `expo.out` and stops dead, because nothing there was
 * pressed. A Feed is pressed: the title and the deck take a few per cent of
 * bounce and settle, and the Echos follow in a short stagger, each one landing
 * on the rule beneath it rather than fading in beside it. The amplitude is
 * deliberately under the threshold at which a reader would call it "an effect"
 * — a platen coming down, not a rubber band. The stagger is capped, so a long
 * Feed finishes its first screenful on a clock rather than on a ratio.
 *
 * The lateral travel is the drum's own direction, kept to a hair's breadth: the
 * strip turned one way, so the sheet settles in from that way. It is continuity
 * with the control, and it is dropped entirely in the calm variant.
 */
export const BOUNCE = 'back.out(2.4)';

/**
 * The reader's motion preference, read from either source at the moment of the
 * turn — the OS setting, or the one Settings writes on the root. Both drums
 * read it the same way; an animation that is already running is not re-cut when
 * the setting changes, only the next one is.
 */
export const prefersCalm = () =>
    (typeof document !== 'undefined' && document.documentElement.dataset.motion === 'reduce') ||
    (typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia(REDUCED).matches);

/**
 * One impression, from the sheet element that carries it.
 *
 * It is cut in two halves because a Feed can arrive in two pieces. **Head** is
 * the choice itself — the sheet's settle, the title, the deck — and plays once
 * per turn. **Body** is the contents, and plays when the contents actually land,
 * which for a Feed already in the pocket is the same frame and for a cold one is
 * a beat later. The caller keeps the halves apart so a cold Feed does not take
 * the impression twice and re-bounce a title the reader is already reading.
 *
 * A Feed with nothing in it is still a change, so the notice arrives on the same
 * clock: an empty Feed should not look like a stuck one.
 *
 * Everything is a `from()`, so the painted state is the default and a script
 * that never runs leaves a complete, readable sheet.
 */
export const impression = (scope, { direction = 1, calm = false, head = true, body = true } = {}) => {
    const tl = gsap.timeline();
    if (!scope) return tl;

    const q = gsap.utils.selector(scope);
    const title = q('.feed-heading h1');
    const deck = q('.feed-heading header > p');

    if (head) {
        if (calm) {
            tl.from(scope, { opacity: 0, duration: 0.22, ease: 'power1.out' }, 0);
            if (title.length) tl.from(title, { opacity: 0, duration: 0.26, ease: 'power1.out' }, 0.02);
            if (deck.length) tl.from(deck, { opacity: 0, duration: 0.26, ease: 'power1.out' }, 0.06);
        } else {
            tl.from(scope, { opacity: 0, x: direction * 10, duration: 0.42, ease: EASE }, 0);
            if (title.length) {
                tl.from(title, { opacity: 0, scale: 0.84, duration: 0.62, ease: BOUNCE }, 0.02);
            }
            if (deck.length) {
                tl.from(deck, { opacity: 0, scale: 0.9, y: 6, duration: 0.56, ease: BOUNCE }, 0.09);
            }
        }
    }

    if (!body) return tl;

    const rule = q('.feed-rule');
    const cards = q('.feed-entries > article');

    if (cards.length === 0) {
        const notices = q('.feed-body > *');
        if (notices.length) {
            tl.from(
                notices,
                calm
                    ? { opacity: 0, duration: 0.24, ease: 'power1.out' }
                    : { opacity: 0, y: 12, duration: 0.5, ease: EASE },
                0.06,
            );
        }
        return tl;
    }

    if (rule.length) {
        tl.from(
            rule,
            calm
                ? { opacity: 0, duration: 0.2, ease: 'power1.out' }
                : { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: EASE },
            0.06,
        );
    }

    tl.from(
        cards,
        calm
            ? {
                  opacity: 0,
                  duration: 0.24,
                  ease: 'power1.out',
                  stagger: (i) => Math.min(i * 0.02, 0.1),
              }
            : {
                  opacity: 0,
                  scale: 0.94,
                  y: 14,
                  duration: 0.58,
                  ease: BOUNCE,
                  stagger: (i) => Math.min(i * 0.045, 0.42),
              },
        0.12,
    );

    return tl;
};

/* -- Wiring ---------------------------------------------------------------- */

/**
 * Tear a section's motion down: kill any trigger, then revert, which puts the
 * targets back in the painted state the `from()` recorded — and, for a `setLines`
 * handle, puts the split heading back to ordinary wrapped text.
 */
export const dispose = (...items) =>
    items.forEach((item) => {
        item?.scrollTrigger?.kill();
        item?.revert?.();
    });

/**
 * One region's motion, in both motion preferences, cleaned up on unmount.
 * `full` gets the authored sequence; `calm` gets an intentional reduction —
 * fewer moves, no travel, no easing on the scrubs — rather than nothing at all.
 * Selector strings inside either callback resolve within `scope`.
 */
export const useSectionMotion = (scope, { full, calm }) =>
    useGSAP(
        () => {
            const mm = gsap.matchMedia(scope);
            if (full) mm.add(FULL, full);
            if (calm) mm.add(REDUCED, calm);
            return () => mm.revert();
        },
        { scope },
    );
