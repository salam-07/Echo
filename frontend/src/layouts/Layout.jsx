import React, { useEffect, useState } from 'react';
import { Sidebar, Navbar, RightSidebar } from '../components/layout';

/**
 * The document: a running head across the top, then three columns — index,
 * corpus, margin.
 *
 * The scroll is the document's own. The previous shell nested
 * `overflow-hidden` around `overflow-y-auto` around the corpus, which meant the
 * page never scrolled and the infinite-scroll sentinel was watching the wrong
 * box (`useInfiniteScroll` observes with `root: null` — the viewport). One
 * scroller, and that whole class of bug is gone.
 *
 * Below `lg` the index is a full-sheet overlay opened from the running head, and
 * the margin is not printed at all.
 */
const Layout = ({ children }) => {
    const [indexOpen, setIndexOpen] = useState(false);

    /* An overlay that covers the sheet should not let the sheet move underneath
       it, and Escape closes anything that covers the reading. */
    useEffect(() => {
        if (!indexOpen) return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setIndexOpen(false);
        };
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [indexOpen]);

    return (
        <div className="min-h-screen">
            <Navbar onToggleSidebar={() => setIndexOpen(true)} />

            <div className="mx-auto flex w-full max-w-[1440px]">
                <div className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[15.5rem] shrink-0 lg:block">
                    <Sidebar />
                </div>

                <main className="min-w-0 flex-1 lg:border-x lg:border-rule">{children}</main>

                <RightSidebar />
            </div>

            {indexOpen && (
                <div className="fixed inset-0 z-40 flex flex-col bg-paper lg:hidden">
                    <div className="flex h-14 items-center justify-between border-b border-rule px-4">
                        <p className="t-label t-label--ink">Contents</p>
                        <button
                            type="button"
                            onClick={() => setIndexOpen(false)}
                            className="t-label -mr-2 flex h-11 items-center px-2 transition-colors hover:text-ink"
                        >
                            Close
                        </button>
                    </div>
                    <div className="min-h-0 flex-1">
                        <Sidebar onNavigate={() => setIndexOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
