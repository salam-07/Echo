import React, { useEffect } from 'react';
import Layout from '../layouts/Layout';
import EchoCard from '../components/EchoCard';
import EchoCardSkeleton from '../components/EchoCardSkeleton';
import { useEchoStore } from '../store/useEchoStore';
import { useScrollStore } from '../store/useScrollStore';

const HomePage = () => {
    const { echos, isLoadingEchos, getAllEchos } = useEchoStore();
    const { selectedScroll, scrollEchos, isLoadingScrollEchos, getScrollEchos } = useScrollStore();

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

    return (
        <Layout>
            <div className="max-w-full space-y-2 mx-3 sm:mx-7">
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
            </div>
        </Layout>
    );
};

export default HomePage;