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
                    <SheetHead label="Feed" subject="Nothing is filling this page yet." />
                    <Notice
                        statement="A Scroll decides what you read."
                        note="Write a rule — tags to admit, authors to allow, an order to read them in — and this page becomes its output. Or follow a Scroll somebody else has already written."
                        actions={
                            <>
                                <Link to="/scroll/new" className="act h-11 px-6">
                                    Write a rule
                                </Link>
                                <Link to="/browse-community" className="act act-outline h-11 px-6">
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
                    label={selectedScroll ? 'Feed' : 'Everything'}
                    subject={selectedScroll ? selectedScroll.name : 'Every echo'}
                    deck={
                        selectedScroll
                            ? selectedScroll.description || undefined
                            : 'Everything written here, newest first.'
                    }
                />

                {isLoading && entries.length === 0 ? (
                    <Placeholder rows={5} />
                ) : entries.length === 0 ? (
                    <Notice
                        statement={selectedScroll ? 'This rule admits nothing yet.' : 'No echoes yet.'}
                        note={
                            selectedScroll
                                ? 'Entries matching its terms will appear here as they are written. You can loosen the rule at any time.'
                                : 'Be the first to write something.'
                        }
                        actions={
                            <Link
                                to={selectedScroll ? `/scroll/${selectedScroll._id}` : '/new'}
                                className="act act-outline h-11 px-6"
                            >
                                {selectedScroll ? 'Open the rule' : 'Write an echo'}
                            </Link>
                        }
                    />
                ) : (
                    <div key={selectedScrollId || 'all'} className="animate-set-in border-t border-rule">
                        {entries.map((echo) => (
                            <EchoCard key={echo._id} echo={echo} />
                        ))}

                        <div ref={sentinelRef}>{isLoading && pagination.hasMore && <Placeholder rows={2} />}</div>

                        {!pagination.hasMore && <Coda />}
                    </div>
                )}
            </Measure>
        </Layout>
    );
};

export default HomePage;
