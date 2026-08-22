import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useScrollStore } from '../../../store/useScrollStore';

/**
 * The feed rules you have written, printed as a list. Clicking one holds it, and
 * the home sheet reads whatever is held.
 *
 * This used to be a five-item 3D wheel — perspective, rotateX, per-item scale and
 * opacity, wheel-event capture, a sliding highlight band. None of that survives
 * contact with a world that has no depth to rotate into, and none of it was doing
 * anything a list of names does not do faster. Held is inversion, as everywhere
 * else.
 */
const ScrollSelector = ({ onNavigate }) => {
    const { scrolls, selectedScroll, setSelectedScroll, getScrolls, isLoadingScrolls } =
        useScrollStore();

    const feeds = useMemo(() => scrolls.filter((scroll) => scroll.type === 'feed'), [scrolls]);

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    /* Hold the first rule until the reader picks another, so the home sheet always
       has one. */
    useEffect(() => {
        if (!selectedScroll && feeds.length > 0) setSelectedScroll(feeds[0]);
    }, [selectedScroll, feeds, setSelectedScroll]);

    if (isLoadingScrolls && feeds.length === 0) {
        return (
            <div aria-hidden="true" className="animate-pulse space-y-2 px-3 py-2">
                <div className="h-2.5 w-24 bg-paper-dim" />
                <div className="h-2.5 w-16 bg-paper-dim" />
            </div>
        );
    }

    if (feeds.length === 0) {
        return (
            <p className="px-3 py-2 text-[0.8125rem] leading-[1.5] text-ink-quiet">
                No rules yet.{' '}
                <Link to="/scroll/new" onClick={onNavigate} className="link-rule text-ink">
                    Write one
                </Link>
                .
            </p>
        );
    }

    return (
        <ul>
            {feeds.map((feed) => {
                const held = selectedScroll?._id === feed._id;
                return (
                    <li key={feed._id}>
                        <button
                            type="button"
                            aria-pressed={held}
                            data-held={held || undefined}
                            onClick={() => {
                                setSelectedScroll(feed);
                                onNavigate?.();
                            }}
                            className="stop t-label min-h-11 w-full justify-start px-3 text-left normal-case tracking-[0.04em]"
                        >
                            <span className="truncate">{feed.name}</span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default ScrollSelector;
