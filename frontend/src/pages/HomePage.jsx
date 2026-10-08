import React, { useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { EchoCard } from '../components/features/echo';
import { Measure, SheetHead, Notice, Placeholder, Coda, Failure } from '../components/editorial/Apparatus';
import { impression, prefersCalm, useGSAP } from '../components/editorial/motion.js';
import { useScrollStore } from '../store/useScrollStore';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

/** The selected rule owns its heading, results, and request state together. */
const HomePage = () => {
    const {
        selectedScroll,
        scrollEchos,
        scrollEchosId,
        scrollEchosError,
        scrollEchosRetryReset,
        feedSwitchDirection,
        isLoadingScrollEchos,
        getScrollEchos,
        loadMoreScrollEchos,
        scrollEchoPagination,
        scrolls,
        hasLoadedScrolls,
        scrollsError,
        isLoadingScrolls,
        getScrolls,
    } = useScrollStore();

    const prefetchFeeds = useScrollStore((state) => state.prefetchFeeds);

    /* The sheet the impression is taken of. */
    const sheetRef = useRef(null);

    const selectedScrollId = selectedScroll?._id;
    const previousFeed = useRef(selectedScrollId);

    useLayoutEffect(() => {
        if (previousFeed.current !== selectedScrollId) {
            // A short new feed must not leave the reader below its contents.
            window.scrollTo({ top: 0, behavior: 'instant' });
            previousFeed.current = selectedScrollId;
        }
    }, [selectedScrollId]);

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    useLayoutEffect(() => {
        if (selectedScrollId) {
            getScrollEchos(selectedScrollId, true, true);
        }
    }, [selectedScrollId, getScrollEchos]);

    const matchesSelection = scrollEchosId === selectedScrollId;
    const entries = selectedScrollId && matchesSelection ? scrollEchos : [];
    const isLoading = selectedScrollId
        ? !matchesSelection || isLoadingScrollEchos
        : !scrollsError;
    const error = selectedScrollId ? (matchesSelection ? scrollEchosError : null) : scrollsError;
    const pagination = scrollEchoPagination;

    /* Turn the drum's first page for every rule that has one, before the reader
       turns to it. The guess lives in the store's pocket, not on the sheet: it
       sets no loading state and shows nothing until it is asked for, at which
       point the switch is already finished rather than merely starting. */
    const feeds = useMemo(() => scrolls.filter((scroll) => scroll.type === 'feed'), [scrolls]);

    useEffect(() => {
        if (!hasLoadedScrolls || scrollsError || feeds.length === 0) return;
        prefetchFeeds(feeds);
    }, [hasLoadedScrolls, scrollsError, feeds, prefetchFeeds]);

    /* An impression is two halves on two clocks. The choice — the sheet's
       settle, the title, the deck — is made once per turn. The contents land
       whenever the Feed's first page does, which for a cached Feed is the same
       frame and for a cold one is a beat later. The second half is keyed to the
       first Echo rather than to the array, so paging past the end of a Feed
       appends rows without re-playing anything above them. */
    const entryKey = `${selectedScrollId ?? 'none'}|${entries[0]?._id ?? 'empty'}`;

    useGSAP(
        () => {
            if (!selectedScrollId) return;
            impression(sheetRef.current, {
                direction: feedSwitchDirection,
                calm: prefersCalm(),
                head: true,
                body: false,
            });
        },
        {
            scope: sheetRef,
            dependencies: [selectedScrollId, feedSwitchDirection],
            revertOnUpdate: true,
        },
    );

    useGSAP(
        () => {
            if (!selectedScrollId) return;
            impression(sheetRef.current, { calm: prefersCalm(), head: false, body: true });
        },
        { scope: sheetRef, dependencies: [entryKey], revertOnUpdate: true },
    );

    const hasNoRules = useMemo(
        () => hasLoadedScrolls && !isLoadingScrolls && !scrolls.some((scroll) => scroll.type === 'feed'),
        [hasLoadedScrolls, isLoadingScrolls, scrolls],
    );

    const handleLoadMore = useCallback(() => {
        if (selectedScrollId) loadMoreScrollEchos(selectedScrollId);
    }, [selectedScrollId, loadMoreScrollEchos]);

    const sentinelRef = useInfiniteScroll(handleLoadMore, pagination.hasMore && !error, isLoading);

    if (hasNoRules) {
        return (
            <Layout>
                <Measure>
                    <SheetHead subject="Your Feed" />
                    <Notice
                        statement="Choose what you want to read."
                        note="Create a Feed around tags and people you like, or follow one from the community."
                        actions={
                            <>
                                <Link to="/welcome" className="act h-11 px-6">
                                    Set up your first Feed
                                </Link>
                                <Link to="/browse-community" className="act act-quiet h-11 px-6">
                                    Browse the community
                                </Link>
                            </>
                        }
                    />
                </Measure>
            </Layout>
        );
    }

    return (
        <Layout>
            <Measure>
                <div ref={sheetRef} key={selectedScrollId || 'all'} className="feed-sheet">
                    <div className="feed-heading">
                        <SheetHead
                            masthead
                            subject={selectedScroll ? selectedScroll.name : 'Your Feed'}
                            deck={
                                selectedScroll
                                    ? selectedScroll.description || undefined
                                        : undefined
                            }
                        />
                    </div>

                    <p className="sr-only" role="status">
                        {isLoading && !entries.length ? `Loading ${selectedScroll?.name || 'Echos'}.` :
                            error || `${selectedScroll?.name || 'Echos'} ready.`}
                    </p>
                    {error && <Failure note={error} onRetry={() => selectedScrollId
                        ? getScrollEchos(selectedScrollId, scrollEchosRetryReset) : getScrolls()} />}

                    <div aria-busy={isLoading} className="feed-body">
                        {isLoading && entries.length === 0 ? (
                            <Placeholder rows={5} />
                        ) : error && entries.length === 0 ? null : entries.length === 0 ? (
                            <Notice
                                statement={selectedScroll ? 'No matching Echos yet.' : 'No Echos yet.'}
                                note={
                                    selectedScroll
                                        ? 'New Echos appear here when they match this Feed. View its settings to see what it includes.'
                                        : 'Be the first to write something.'
                                }
                                actions={
                                    <Link
                                        to={selectedScroll ? `/scroll/${selectedScroll._id}` : '/new'}
                                        className="act act-outline h-11 px-6"
                                    >
                                        {selectedScroll ? 'View Feed' : 'Post an Echo'}
                                    </Link>
                                }
                            />
                        ) : (
                            <div className="feed-entries">
                                {/* The rule the Echos hang from, as an element of its own
                                    so the impression can strike it without scaling the
                                    entries with it. */}
                                <div className="feed-rule origin-left border-t border-rule" aria-hidden="true" />
                                {entries.map((echo) => (
                                    <EchoCard key={echo._id} echo={echo} />
                                ))}

                                {!pagination.hasMore && <Coda label="You’re all caught up" />}
                            </div>
                        )}
                        <div ref={sentinelRef}>{isLoading && entries.length > 0 && pagination.hasMore && <Placeholder rows={2} />}</div>
                    </div>
                </div>
            </Measure>
        </Layout>
    );
};

export default HomePage;
