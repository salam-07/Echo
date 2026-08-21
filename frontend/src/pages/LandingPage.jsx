import { useLayoutEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    SheetIndex,
    CoverSheet,
    SectionThrough,
    TwoWays,
    GeneralNotes,
    TheRoom,
    IssuedFor,
} from '../components/landing';

/**
 * THE WORKING DRAWING — the landing surface, issued as a set of six sheets.
 *
 * The whole surface is scoped under `.sheetset`, which is where its colours,
 * three lettering registers and drawn lines live. The authenticated app keeps
 * its own DaisyUI themes untouched; there is no light or dark here, because a
 * drawing sheet has one state.
 */

const LandingPage = () => {
    useLayoutEffect(() => {
        const root = document.documentElement;
        const previous = { overflow: root.style.overflowX, background: root.style.backgroundColor };

        // The light table extends past the sheets, including behind overscroll.
        root.style.overflowX = 'clip';
        root.style.backgroundColor = '#eeede9';

        // Condensed lettering changes every measurement on the page, so the
        // triggers are recomputed once the real faces are in.
        let timer;
        const refresh = () => {
            timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
        };
        if (document.fonts?.ready) document.fonts.ready.then(refresh);
        else refresh();

        return () => {
            window.clearTimeout(timer);
            root.style.overflowX = previous.overflow;
            root.style.backgroundColor = previous.background;
        };
    }, []);

    return (
        <div className="sheetset min-h-screen pt-3 sm:pt-5 lg:pt-8">
            <a
                href="#issue"
                className="drafted sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-graphite focus:bg-sheet focus:px-4 focus:py-2.5 focus:text-[0.75rem] focus:leading-none focus:text-graphite"
            >
                Skip to sign-up
            </a>

            <SheetIndex />

            <main>
                <CoverSheet />
                <SectionThrough />
                <TwoWays />
                <GeneralNotes />
                <TheRoom />
                <IssuedFor />
            </main>
        </div>
    );
};

export default LandingPage;
