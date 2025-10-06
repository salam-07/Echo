import React, { useEffect } from 'react';
import Layout from '../layouts/Layout';
import EchoCard from '../components/EchoCard';
import EchoCardSkeleton from '../components/EchoCardSkeleton';
import { useEchoStore } from '../store/useEchoStore';

const HomePage = () => {
    const { echos, isLoadingEchos, getAllEchos } = useEchoStore();

    useEffect(() => {
        getAllEchos();
    }, [getAllEchos]);

    return (
        <Layout>
            <div className="max-w-full space-y-2 mx-7">
                {/* Loading State */}
                {isLoadingEchos && echos.length === 0 && (
                    <div className="space-y-0">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <EchoCardSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoadingEchos && echos.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-base-content mb-2">No echoes yet</h3>
                        <p className="text-base-content/60 text-sm">Be the first to share your thoughts!</p>
                    </div>
                )}

                {/* Echoes List */}
                {echos.length > 0 && (
                    <div className="space-y-4">
                        {echos.map((echo) => (
                            <EchoCard key={echo._id} echo={echo} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;