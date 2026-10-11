import React, { useCallback, useState } from 'react';
import { Sidebar, Navbar, RightSidebar } from '../components/layout';
import MobileNavigation from '../components/layout/MobileNavigation';
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
 * Below `lg` the index is a paper drawer opened from the running head, and
 * the margin is not printed at all.
 */
const Layout = ({ children }) => {
    const [indexOpen, setIndexOpen] = useState(false);

    const closeIndex = useCallback(() => setIndexOpen(false), []);

    return (
        <div className="min-h-screen">
            <Navbar onToggleSidebar={() => setIndexOpen(true)} sidebarOpen={indexOpen} />

            <div className="mx-auto flex w-full max-w-[1440px]">
                <div className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[15.5rem] shrink-0 lg:block">
                    <Sidebar />
                </div>

                <main className="min-w-0 flex-1 lg:border-x lg:border-rule">
                    {children}
                </main>

                <RightSidebar />
            </div>

            <MobileNavigation open={indexOpen} onClose={closeIndex} />
        </div>
    );
};

export default Layout;
