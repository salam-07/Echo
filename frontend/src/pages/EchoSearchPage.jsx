import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useSearchStore } from '../store/useSearchStore';
import { useEchoStore } from '../store/useEchoStore';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import EchoCard from '../components/features/echo/EchoCard';

const EchoSearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const {
        echos,
        echosPagination,
        isSearching,
        isLoadingMore,
        searchEchos
    } = useSearchStore();

    const { likeEcho } = useEchoStore();

    useEffect(() => {
        if (query) {
            searchEchos(query, 1);
        }
    }, [query, searchEchos]);

    const handleLoadMore = () => {
        if (echosPagination && echosPagination.page < echosPagination.totalPages) {
            searchEchos(query, echosPagination.page + 1);
        }
    };

    const hasMore = echosPagination && echosPagination.page < echosPagination.totalPages;

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        to={`/search?q=${encodeURIComponent(query)}`}
                        className="p-2 -ml-2 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-content/5 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-medium text-base-content">Echos</h1>
                        <p className="text-xs text-base-content/40">
                            Search results for "{query}"
                            {echosPagination && ` • ${echosPagination.total} results`}
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {isSearching && echos.length === 0 && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 text-base-content/30 animate-spin" />
                    </div>
                )}

                {/* No Results */}
                {!isSearching && echos.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200/30 mb-4">
                            <Search className="w-7 h-7 text-base-content/30" />
                        </div>
                        <p className="text-base-content/60 mb-2">No echos found</p>
                        <p className="text-base-content/40 text-sm">
                            Try different keywords
                        </p>
                    </div>
                )}

                {/* Results */}
                {echos.length > 0 && (
                    <div className="space-y-0">
                        {echos.map((echo) => (
                            <EchoCard
                                key={echo._id}
                                echo={echo}
                                onLike={() => likeEcho(echo._id)}
                            />
                        ))}

                        {/* Load More */}
                        {hasMore && (
                            <div className="pt-6 flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="px-6 py-2 text-sm text-base-content/60 hover:text-base-content border border-base-content/10 hover:border-base-content/20 rounded-full transition-colors disabled:opacity-50"
                                >
                                    {isLoadingMore ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Load more'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default EchoSearchPage;
