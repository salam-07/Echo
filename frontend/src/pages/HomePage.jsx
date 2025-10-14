import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { EchoCard, EchoCardSkeleton } from '../components/features/echo';
import { useEchoStore } from '../store/useEchoStore';
import { useScrollStore } from '../store/useScrollStore';
import useInfiniteScroll from '../hooks/useInfiniteScrollNew';

const HomePage = () => {
    const navigate = useNavigate();
    const { getPaginatedEchos } = useEchoStore();
    const { selectedScroll, getPaginatedScrollEchos, scrolls, isLoadingScrolls, getScrolls } = useScrollStore();

    // Load scrolls
    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    // Create fetch function for infinite scroll
    const fetchFunction = useMemo(() => {
        if (selectedScroll) {
            return (page, limit) => getPaginatedScrollEchos(selectedScroll._id, page, limit);
        } else {
            return (page, limit) => getPaginatedEchos(page, limit);
        }
    }, [selectedScroll, getPaginatedEchos, getPaginatedScrollEchos]);

    // Use infinite scroll hook
    const {
        items: displayEchos,
        loading,
        hasMore,
        error,
        initialLoad
    } = useInfiniteScroll(fetchFunction, {
        limit: 10,
        threshold: 200,
        dependencies: [selectedScroll?._id],
        enabled: !isLoadingScrolls
    });

    // Check if user has any scrolls
    const feedScrolls = scrolls.filter(scroll => scroll.type === 'feed');
    const hasNoScrolls = !isLoadingScrolls && feedScrolls.length === 0;

    // Loading indicator component
    const LoadingIndicator = () => (
        <div className="flex justify-center py-4">
            <div className="loading loading-spinner loading-md"></div>
        </div>
    );

    return (
        <Layout>
            <div className="max-w-full space-y-2 mx-3 sm:mx-7">
                {/* No Scrolls State */}
                {hasNoScrolls && (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-base-content mb-3">No Scrolls</h3>
                        <p className="text-base-content/60 mb-6">
                            Get started by creating your first scroll or browse what others have shared
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <button
                                onClick={() => navigate('/scroll/new')}
                                className="btn btn-primary"
                            >
                                Create Your First Scroll
                            </button>
                            <button
                                onClick={() => navigate('/browse-community')}
                                className="btn btn-outline"
                            >
                                Browse Community Scrolls
                            </button>
                        </div>
                    </div>
                )}

                {/* Normal Content - only show when user has scrolls */}
                {!hasNoScrolls && (
                    <>
                        {/* Scroll Info */}
                        {selectedScroll && (
                            <div className="mb-4 pb-3 border-b border-base-300">
                                <h2 className="text-lg font-semibold text-base-content">{selectedScroll.name}</h2>
                                {selectedScroll.description && (
                                    <p className="text-sm text-base-content/60 mt-1">{selectedScroll.description}</p>
                                )}
                            </div>
                        )}

                        {/* Initial Loading State */}
                        {initialLoad && (
                            <div className="space-y-0">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <EchoCardSkeleton key={index} />
                                ))}
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-12">
                                <div className="alert alert-error max-w-md mx-auto">
                                    <span>Failed to load echos. Please try again.</span>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!initialLoad && !loading && displayEchos.length === 0 && !error && (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-semibold text-base-content mb-2">
                                    {selectedScroll ? 'No echos match your filters' : 'No echoes yet'}
                                </h3>
                                <p className="text-base-content/60 text-sm">
                                    {selectedScroll
                                        ? 'Try adjusting your scroll settings or check back later'
                                        : 'Be the first to share your thoughts!'}
                                </p>
                            </div>
                        )}

                        {/* Echoes List */}
                        {displayEchos.length > 0 && (
                            <div className="space-y-4">
                                {displayEchos.map((echo) => (
                                    <EchoCard key={echo._id} echo={echo} />
                                ))}

                                {/* Load More Indicator */}
                                {loading && <LoadingIndicator />}

                                {/* End of Content Indicator */}
                                {!hasMore && displayEchos.length > 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-sm text-base-content/50">
                                            You've reached the end of the scroll
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;