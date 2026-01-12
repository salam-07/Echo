import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useSearchStore } from '../store/useSearchStore';
import { FollowButton } from '../components/features/scroll';
import { ArrowLeft, Search, Loader2, Filter, BookMarked } from 'lucide-react';

const ScrollSearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'feed';

    const {
        feeds,
        curations,
        scrollsPagination,
        isSearching,
        isLoadingMore,
        searchScrolls
    } = useSearchStore();

    const scrolls = type === 'feed' ? feeds : curations;

    useEffect(() => {
        if (query) {
            searchScrolls(query, type, 1);
        }
    }, [query, type, searchScrolls]);

    const handleLoadMore = () => {
        if (scrollsPagination && scrollsPagination.page < scrollsPagination.totalPages) {
            searchScrolls(query, type, scrollsPagination.page + 1);
        }
    };

    const hasMore = scrollsPagination && scrollsPagination.page < scrollsPagination.totalPages;
    const Icon = type === 'feed' ? Filter : BookMarked;
    const title = type === 'feed' ? 'Feeds' : 'Curations';

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
                        <h1 className="text-lg font-medium text-base-content">{title}</h1>
                        <p className="text-xs text-base-content/40">
                            Search results for "{query}"
                            {scrollsPagination && ` • ${scrollsPagination.total} results`}
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {isSearching && scrolls.length === 0 && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 text-base-content/30 animate-spin" />
                    </div>
                )}

                {/* No Results */}
                {!isSearching && scrolls.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200/30 mb-4">
                            <Search className="w-7 h-7 text-base-content/30" />
                        </div>
                        <p className="text-base-content/60 mb-2">No {title.toLowerCase()} found</p>
                        <p className="text-base-content/40 text-sm">
                            Try different keywords
                        </p>
                    </div>
                )}

                {/* Results */}
                {scrolls.length > 0 && (
                    <div className="space-y-2">
                        {scrolls.map((scroll) => (
                            <Link
                                key={scroll._id}
                                to={`/scroll/${scroll._id}`}
                                className="block p-4 rounded-lg border border-base-content/5 hover:border-base-content/10 hover:bg-base-content/[0.02] transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-base-content/5 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-base-content/40" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-base-content/80 truncate">
                                                    {scroll.name}
                                                </h3>
                                                {scroll.description && (
                                                    <p className="text-xs text-base-content/40 line-clamp-2 mt-0.5">
                                                        {scroll.description}
                                                    </p>
                                                )}
                                                <p className="text-xs text-base-content/30 mt-1.5">
                                                    by @{scroll.creator?.userName}
                                                    {type === 'curation' && ` • ${scroll.echos?.length || 0} echos`}
                                                </p>
                                            </div>
                                            <FollowButton scroll={scroll} size="sm" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
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

export default ScrollSearchPage;
