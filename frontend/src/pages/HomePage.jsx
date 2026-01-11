import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { EchoCard, EchoCardSkeleton } from '../components/features/echo';
import { useEchoStore } from '../store/useEchoStore';
import { useScrollStore } from '../store/useScrollStore';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const HomePage = () => {
    const navigate = useNavigate();
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
        getScrolls
    } = useScrollStore();

    // Load scrolls once on mount
    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    // Load echos based on selected scroll - use ID for stable dependency
    const selectedScrollId = selectedScroll?._id;
    useEffect(() => {
        if (selectedScrollId) {
            getScrollEchos(selectedScrollId, true);
        } else if (!isLoadingScrolls && scrolls.length > 0) {
            // Only load all echos if we have scrolls but none selected
        } else if (!isLoadingScrolls && scrolls.length === 0) {
            getAllEchos({}, true);
        }
    }, [selectedScrollId, isLoadingScrolls, scrolls.length, getAllEchos, getScrollEchos]);

    // Memoize derived state
    const displayEchos = useMemo(() =>
        selectedScroll ? scrollEchos : echos,
        [selectedScroll, scrollEchos, echos]
    );

    const isLoading = selectedScroll ? isLoadingScrollEchos : isLoadingEchos;
    const pagination = selectedScroll ? scrollEchoPagination : echoPagination;

    // Memoize feed scrolls filter
    const feedScrolls = useMemo(() =>
        scrolls.filter(scroll => scroll.type === 'feed'),
        [scrolls]
    );
    const hasNoScrolls = !isLoadingScrolls && feedScrolls.length === 0;

    // Load more function for infinite scroll
    const handleLoadMore = useCallback(() => {
        if (selectedScrollId) {
            loadMoreScrollEchos(selectedScrollId);
        } else {
            loadMoreEchos({});
        }
    }, [selectedScrollId, loadMoreEchos, loadMoreScrollEchos]);

    // Setup infinite scroll
    const sentinelRef = useInfiniteScroll(
        handleLoadMore,
        pagination.hasMore,
        isLoading
    );

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* No Scrolls State */}
                {hasNoScrolls && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                        <div className="w-16 h-16 rounded-2xl bg-base-200/50 flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-base-content mb-2">No scrolls yet</h3>
                        <p className="text-base-content/50 mb-8 max-w-sm">
                            Create your first scroll to curate your perfect feed
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => navigate('/scroll/new')}
                                className="px-6 py-2.5 bg-base-content text-base-100 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Create Scroll
                            </button>
                            <button
                                onClick={() => navigate('/browse-community')}
                                className="px-6 py-2.5 border border-base-300 rounded-full text-sm font-medium text-base-content/70 hover:border-base-content/30 transition-colors"
                            >
                                Browse Community
                            </button>
                        </div>
                    </div>
                )}

                {/* Feed Content */}
                {!hasNoScrolls && (
                    <div className="py-4 sm:py-6">
                        {/* Scroll Header */}
                        {selectedScroll && (
                            <div className="mb-6 sm:mb-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-base-content tracking-tight">
                                    {selectedScroll.name}
                                </h1>
                                {selectedScroll.description && (
                                    <p className="text-base-content/50 mt-2 text-sm sm:text-base leading-relaxed">
                                        {selectedScroll.description}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && displayEchos.length === 0 && (
                            <div className="space-y-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <EchoCardSkeleton key={index} />
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && displayEchos.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-12 h-12 rounded-full bg-base-200/50 flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-medium text-base-content mb-1">
                                    {selectedScroll ? 'No echos yet' : 'Nothing here'}
                                </h3>
                                <p className="text-sm text-base-content/40 max-w-xs">
                                    {selectedScroll
                                        ? 'Echos matching your scroll filters will appear here'
                                        : 'Be the first to share something'}
                                </p>
                            </div>
                        )}

                        {/* Echoes List */}
                        {displayEchos.length > 0 && (
                            <div>
                                {displayEchos.map((echo, index) => (
                                    <EchoCard key={echo._id} echo={echo} isFirst={index === 0} />
                                ))}

                                {/* Infinite Scroll Sentinel */}
                                <div ref={sentinelRef}>
                                    {isLoading && pagination.hasMore && (
                                        <div className="space-y-1">
                                            {Array.from({ length: 2 }).map((_, index) => (
                                                <EchoCardSkeleton key={`loading-${index}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* End indicator */}
                                {!pagination.hasMore && displayEchos.length > 0 && (
                                    <div className="py-12 text-center">
                                        <div className="inline-flex items-center gap-2 text-xs text-base-content/30">
                                            <div className="w-8 h-px bg-base-content/10" />
                                            <span>End of scroll</span>
                                            <div className="w-8 h-px bg-base-content/10" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;