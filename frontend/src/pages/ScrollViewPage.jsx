import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { EchoCard, EchoCardSkeleton } from '../components/features/echo';
import { useScrollStore } from '../store/useScrollStore';
import useInfiniteScroll from '../hooks/useInfiniteScrollNew';
import { ArrowLeft, Trash2 } from 'lucide-react';

const ScrollViewPage = () => {
    const { id } = useParams();
    const { scroll, isLoadingScroll, getScrollById, deleteScroll, isDeletingScroll, getPaginatedScrollEchos } = useScrollStore();

    useEffect(() => {
        if (id) {
            getScrollById(id);
        }
    }, [id, getScrollById]);

    // Create fetch function for infinite scroll
    const fetchFunction = useMemo(() => {
        return (page, limit) => getPaginatedScrollEchos(id, page, limit);
    }, [id, getPaginatedScrollEchos]);

    // Use infinite scroll hook
    const {
        items: scrollEchos,
        loading,
        hasMore,
        error,
        initialLoad
    } = useInfiniteScroll(fetchFunction, {
        limit: 10,
        threshold: 200,
        dependencies: [id],
        enabled: !!id && !isLoadingScroll
    });

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${scroll?.name}"?`)) {
            try {
                await deleteScroll(id);
                window.location.href = '/scrolls';
            } catch (error) {
                console.log('Error deleting scroll:', error);
            }
        }
    };

    // Loading indicator component
    const LoadingIndicator = () => (
        <div className="flex justify-center py-4">
            <div className="loading loading-spinner loading-md"></div>
        </div>
    );

    if (isLoadingScroll) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <p className="text-center text-base-content/60">Loading scroll...</p>
                </div>
            </Layout>
        );
    }

    if (!scroll) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <p className="text-center text-base-content/60">Scroll not found</p>
                    <div className="text-center mt-4">
                        <Link to="/scrolls" className="text-primary hover:underline">
                            Back to Scrolls
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Link
                            to="/scrolls"
                            className="p-2 rounded-lg hover:bg-base-200 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-base-content/70" />
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-base-content">
                                    {scroll.name}
                                </h1>
                                <span className={`text-xs px-2 py-1 rounded-full ${scroll.type === 'feed'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-secondary/10 text-secondary'
                                    }`}>
                                    {scroll.type === 'feed' ? 'Feed' : 'Curation'}
                                </span>
                            </div>
                            {scroll.description && (
                                <p className="text-sm text-base-content/60 mt-1">
                                    {scroll.description}
                                </p>
                            )}
                            {scroll.type === 'feed' && scroll.feedConfig && (
                                <div className="mt-2">
                                    {scroll.feedConfig.includedTags && scroll.feedConfig.includedTags.length > 0 && (
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs text-base-content/50 font-medium">Includes:</span>
                                            {scroll.feedConfig.includedTags.map((tag, index) => (
                                                <span key={tag._id || index} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                                    #{tag.name}
                                                </span>
                                            ))}
                                            {scroll.feedConfig.tagMatchType === 'all' && (
                                                <span className="text-xs text-base-content/40">(all required)</span>
                                            )}
                                        </div>
                                    )}
                                    {scroll.feedConfig.excludedTags && scroll.feedConfig.excludedTags.length > 0 && (
                                        <div className="flex items-center gap-2 flex-wrap mt-1">
                                            <span className="text-xs text-base-content/50 font-medium">Excludes:</span>
                                            {scroll.feedConfig.excludedTags.map((tag, index) => (
                                                <span key={tag._id || index} className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={isDeletingScroll}
                            className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Delete scroll"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Echos */}
                <div>
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
                    {!initialLoad && !loading && scrollEchos.length === 0 && !error && (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-base-content mb-2">
                                {scroll.type === 'feed' ? 'No echos match your filters' : 'No echos in this curation'}
                            </h3>
                            <p className="text-base-content/60 text-sm">
                                {scroll.type === 'feed'
                                    ? 'Try adjusting your scroll settings or check back later'
                                    : 'Add echos to this curation from any echo\'s menu'}
                            </p>
                        </div>
                    )}

                    {/* Echos List */}
                    {scrollEchos.length > 0 && (
                        <div className="space-y-4">
                            {scrollEchos.map((echo) => (
                                <EchoCard key={echo._id} echo={echo} />
                            ))}

                            {/* Load More Indicator */}
                            {loading && <LoadingIndicator />}

                            {/* End of Content Indicator */}
                            {!hasMore && scrollEchos.length > 0 && (
                                <div className="text-center py-8">
                                    <p className="text-sm text-base-content/50">
                                        You've reached the end of the scroll
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ScrollViewPage;