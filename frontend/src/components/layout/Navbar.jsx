import React, { useCallback, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HorizontalDrum from '../features/scroll/HorizontalDrum.jsx';
import { useScrollStore } from '../../store/useScrollStore';

/**
 * The running head. It sits above every sheet in the document and carries three
 * things: whose document this is, which sheet you are on, and the one control
 * that reaches any sheet at all.
 *
 * The address is derived here rather than passed in, because twenty screens
 * passing their own §-number is twenty chances for the index column and the
 * running head to disagree about where you are.
 */

const ADDRESS = [
    ['/settings', '§05', 'Settings'],
    ['/profile', '§05', 'Account'],
    ['/user/', '§05', 'Account'],
    ['/search', '§04', 'Search'],
    ['/browse', '§03', 'Community'],
    ['/community', '§03', 'Community'],
    ['/tag/', '§03', 'Tags'],
    ['/scrolls', '§02', 'Scrolls'],
    ['/scroll/new', '§02', 'New scroll'],
    ['/scroll/', '§02', 'Scrolls'],
    ['/new', '§01', 'New echo'],
    ['/echo/', '§01', 'Echo'],
];

export const addressFor = (pathname) => {
    const match = ADDRESS.find(([prefix]) => pathname.startsWith(prefix));
    return match ? { reference: match[1], name: match[2] } : { reference: '§01', name: 'Feed' };
};

const Navbar = ({ onToggleSidebar }) => {
    const { pathname } = useLocation();
    const { reference, name } = addressFor(pathname);

    const { scrolls, selectedScroll, setSelectedScroll, getScrolls, isLoadingScrolls } =
        useScrollStore();

    /* The running head owns the feed selector now, so it loads the rules itself
       rather than leaning on whichever sheet happens to be mounted beside it. */
    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    /* Only feed-type scrolls turn in the drum; curations are filed elsewhere. */
    const feeds = useMemo(() => scrolls.filter((scroll) => scroll.type === 'feed'), [scrolls]);

    /* The drum is a pure instrument: hand it a strip of names, the one to stand at
       the centre, and a callback for when it arrests. */
    const items = useMemo(() => feeds.map((feed) => ({ id: feed._id, name: feed.name })), [feeds]);

    const centerIndex = useMemo(() => {
        const found = feeds.findIndex((feed) => feed._id === selectedScroll?._id);
        return found < 0 ? 0 : found;
    }, [feeds, selectedScroll?._id]);

    /* A register should be found already set: when nothing is held, the first feed
       is, so the home sheet always has a rule to read. */
    useEffect(() => {
        if (feeds.length === 0) return;
        const held = feeds.some((feed) => feed._id === selectedScroll?._id);
        if (!held) setSelectedScroll(feeds[0]);
    }, [feeds, selectedScroll?._id, setSelectedScroll]);

    /* The drum registers when it stops; this is where that choice is written back
       to the store, which the home sheet reads to know which rule to fetch. */
    const handleChange = useCallback(
        (index) => {
            const feed = feeds[index];
            if (feed) setSelectedScroll(feed);
        },
        [feeds, setSelectedScroll],
    );

    return (
        <header className="sticky top-0 z-30 h-14 border-b border-rule bg-paper">
            <div className="relative mx-auto flex h-full max-w-[1440px] items-center gap-4 px-4 lg:px-6">
                <div className="flex flex-1 items-center gap-4">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="t-label -ml-2 flex h-11 items-center px-2 text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-ink lg:hidden"
                    >
                        Index
                    </button>

                    <Link
                        to="/"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[1.25rem] leading-none tracking-[-0.01em] text-ink lg:static lg:translate-x-0 lg:translate-y-0"
                    >
                        echo
                    </Link>
                </div>

                {/* The horizontal drum, wired to the scroll selector — the feeds are
                    its strip, the held rule its centre, and turning it writes the
                    choice back. On the wide head it hangs in the centre; on a narrow
                    one it drops to its own sticky band along the foot of the page,
                    where a thumb can reach it. */}
                <div className="fixed inset-x-0 bottom-0 z-30 flex min-w-0 justify-center border-t border-rule bg-paper px-4 py-1 lg:static lg:inset-x-auto lg:bottom-auto lg:z-auto lg:flex-[3] lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
                    <div className="w-full max-w-[34rem]">
                        {feeds.length > 0 ? (
                            <HorizontalDrum
                                items={items}
                                centerIndex={centerIndex}
                                onChange={handleChange}
                            />
                        ) : (
                            /* Both states keep the band's own height (2.75rem) so the
                               head never jumps as the rules arrive or run out. While
                               they load, nothing; once they are known to be empty, the
                               one thing there is to do about it. */
                            <div className="flex h-11 items-center justify-center">
                                {!isLoadingScrolls && (
                                    <Link
                                        to="/scroll/new"
                                        className="t-label link-rule text-ink-quiet transition-colors hover:text-ink"
                                    >
                                        Write a feed
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 justify-end">
                    <Link
                        to="/search"
                        className="t-label flex h-11 items-center px-1 text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-ink"
                    >
                        Search
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
