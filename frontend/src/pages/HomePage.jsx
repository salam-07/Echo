import React, { useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { EchoCard } from '../components/features/echo';
import { Measure, SheetHead, Notice, Placeholder, Coda } from '../components/editorial/Apparatus';
import { useEchoStore } from '../store/useEchoStore';
import { useScrollStore } from '../store/useScrollStore';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

/**
 * The feed — one column of entries under the head of whichever rule is held.
 *
 * The old page ran a small state machine (a switching flag, a visibility flag, a
 * previous-id ref and a 50ms timer) to fade between rules. A `key` on the list
 * does the same thing: React unmounts the old column, the new one mounts and
 * plays `animate-set-in` once. Same result, four fewer pieces of state.
 */
const HomePage = () => {
    const { echos, isLoadingEchos, getAllEchos, loadMoreEchos, echoPagination } = useEchoStore();
    const {
        selectedScroll,
        scrollEchos,
        isLoadingScrollEchos,
        getScrollEchos,
        loadMoreScrollEchos,
        scrollEchoPagination,
        scrolls,
        isLoadingScrolls,
        getScrolls,
    } = useScrollStore();

    const selectedScrollId = selectedScroll?._id;

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    useEffect(() => {
        if (selectedScrollId) {
            getScrollEchos(selectedScrollId, true);
        } else if (!isLoadingScrolls && scrolls.length === 0) {
            getAllEchos({}, true);
        }
    }, [selectedScrollId, isLoadingScrolls, scrolls.length, getAllEchos, getScrollEchos]);

    const entries = selectedScrollId ? scrollEchos : echos;
    const isLoading = selectedScrollId ? isLoadingScrollEchos : isLoadingEchos;
    const pagination = selectedScrollId ? scrollEchoPagination : echoPagination;

    const hasNoRules = useMemo(
        () => !isLoadingScrolls && !scrolls.some((scroll) => scroll.type === 'feed'),
        [isLoadingScrolls, scrolls],
    );

    const handleLoadMore = useCallback(() => {
        if (selectedScrollId) loadMoreScrollEchos(selectedScrollId);
        else loadMoreEchos({});
    }, [selectedScrollId, loadMoreEchos, loadMoreScrollEchos]);

    const sentinelRef = useInfiniteScroll(handleLoadMore, pagination.hasMore, isLoading);

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
                <SheetHead
                    subject={selectedScroll ? selectedScroll.name : 'All Echos'}
                    deck={
                        selectedScroll
                            ? selectedScroll.description || undefined
                                : 'Newest first.'
                    }
                />

                {isLoading && entries.length === 0 ? (
                    <Placeholder rows={5} />
                ) : entries.length === 0 ? (
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
                    <div key={selectedScrollId || 'all'} className="animate-set-in border-t border-rule">
                        {entries.map((echo) => (
                            <EchoCard key={echo._id} echo={echo} />
                        ))}

                        <div ref={sentinelRef}>{isLoading && pagination.hasMore && <Placeholder rows={2} />}</div>

                        {!pagination.hasMore && <Coda label="You’re all caught up" />}
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default HomePage;
