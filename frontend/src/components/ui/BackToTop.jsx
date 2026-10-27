import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { prefersCalm } from '../editorial/motion.js';

/**
 * The way back to the head of the sheet.
 *
 * Everything else in this document is *set* on the paper: the reader scrolls and
 * the page stays where it was put. This control cannot be set anywhere, because
 * the thing it acts on is the reader's own distance down the sheet — it has to
 * hold still while the page moves under it, which in CSS means the viewport
 * rather than the flow. Two consequences follow, and both are why this is not
 * simply an `.act` with `fixed` on it:
 *
 *   · It is portalled to the body. `position: fixed` is measured from the
 *     viewport only while no ancestor carries a transform, and the feed's
 *     columns keep a settled one from their entrance — rendered inline the
 *     control would pin to the top of that column instead of to the screen.
 *     `Modal` portals for the same reason.
 *
 *   · It is laid out through the document's own measure: the same 1440px
 *     container, with the margin column's 15.5rem held open as a spacer, so it
 *     lands on the corpus's right edge rather than on top of the Curations. Below
 *     `lg` there is no margin column to clear, so no spacer is printed and the
 *     control takes the page's own margin.
 *
 * The wrapper takes no pointer events, so the band it occupies is not a strip
 * across the foot of the page that swallows clicks meant for the sheet.
 *
 * It appears once the reader is past the first screen — where a way back is
 * worth the ink — and not before.
 */

/** Roughly one screenful. Closer than that and the head is a flick away. */
const reach = () => Math.max(400, window.innerHeight);

const BackToTop = () => {
    const [shown, setShown] = useState(false);

    useEffect(() => {
        /* One read per frame at most. A scroll event fires far more often than
           the page paints, and the answer here only ever changes twice — so the
           read is moved to the frame and the state is left alone when it has not
           moved, which is what keeps this from re-rendering the whole feed on
           every wheel tick. */
        let frame = 0;

        const read = () => {
            frame = 0;
            const next = window.scrollY > reach();
            setShown((current) => (current === next ? current : next));
        };

        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(read);
        };

        read();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    /* `instant` under a reduced-motion preference, which is the same call the
       feed makes when it takes the reader back to the head of a new Feed. */
    const toTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: prefersCalm() ? 'instant' : 'smooth' });
    }, []);

    return createPortal(
        <div className="pointer-events-none fixed inset-x-0 bottom-16 z-30 lg:bottom-6">
            <div className="mx-auto flex w-full max-w-[1440px] justify-end px-6 lg:px-0">
                {/* Keep the compact label, with a full thumb-sized target. */}
                <button
                    type="button"
                    onClick={toTop}
                    data-shown={shown ? 'true' : 'false'}
                    aria-label="Back to top"
                    className="to-top act pointer-events-auto h-11 gap-1.5 px-3 text-[0.625rem] sm:gap-2 sm:px-5 sm:text-xs lg:mr-6"
                >
                    <span aria-hidden="true" className="text-[1.1em]">↑</span>
                    Top
                </button>

                {/* The margin column, held open and drawing nothing. */}
                <div aria-hidden="true" className="hidden lg:block lg:w-[15.5rem] lg:shrink-0" />
            </div>
        </div>,
        document.body,
    );
};

export default BackToTop;
