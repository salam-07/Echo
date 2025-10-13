import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import EchoCard from '../components/EchoCard';
import EchoCardSkeleton from '../components/EchoCardSkeleton';
import { useEchoStore } from '../store/useEchoStore';
import { useScrollStore } from '../store/useScrollStore';

const HomePage = () => {
    const navigate = useNavigate();
    const { echos, isLoadingEchos, getAllEchos } = useEchoStore();
    const { selectedScroll, scrollEchos, isLoadingScrollEchos, getScrollEchos, scrolls, isLoadingScrolls, getScrolls } = useScrollStore();

    // Load scrolls and echos
    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    // Load echos based on selected scroll
    useEffect(() => {
        if (selectedScroll) {
            getScrollEchos(selectedScroll._id);
        } else {
            getAllEchos();
        }
    }, [selectedScroll, getAllEchos, getScrollEchos]);

    // Determine which echos to display
    const displayEchos = selectedScroll ? scrollEchos : echos;
    const isLoading = selectedScroll ? isLoadingScrollEchos : isLoadingEchos;

    // Check if user has any scrolls
    const feedScrolls = scrolls.filter(scroll => scroll.type === 'feed');
    const hasNoScrolls = !isLoadingScrolls && feedScrolls.length === 0;

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

                        {/* Loading State */}
                        {isLoading && displayEchos.length === 0 && (
                            <div className="space-y-0">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <EchoCardSkeleton key={index} />
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && displayEchos.length === 0 && (
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
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;