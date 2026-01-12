import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import useCommunityStore from '../store/useCommunityStore';
import Layout from '../layouts/Layout';

const BrowseScrollsPage = () => {
    const {
        feedScrolls,
        isLoadingFeeds,
        fetchPublicFeedScrolls
    } = useCommunityStore();

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPublicFeedScrolls();
    }, [fetchPublicFeedScrolls]);

    // Memoized filtered scrolls for performance
    const filteredScrolls = useMemo(() => {
        if (!searchQuery.trim()) return feedScrolls;

        const query = searchQuery.toLowerCase();
        return feedScrolls.filter(scroll =>
            scroll.name.toLowerCase().includes(query) ||
            scroll.description?.toLowerCase().includes(query) ||
            scroll.creator?.userName.toLowerCase().includes(query)
        );
    }, [searchQuery, feedScrolls]);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        to="/community"
                        className="inline-flex items-center gap-1 text-sm text-base-content/40 hover:text-base-content mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Explore
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
                        Feed Scrolls
                    </h1>
                    <p className="text-base-content/40">
                        Discover dynamic feeds curated by the community
                    </p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                        <input
                            type="text"
                            placeholder="Search feeds..."
                            className="w-full h-12 pl-11 pr-4 bg-base-content/[0.03] border-0 rounded-xl text-base-content placeholder:text-base-content/30 focus:outline-none focus:ring-2 focus:ring-base-content/10"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {/* Results count */}
                {!isLoadingFeeds && (
                    <p className="text-xs text-base-content/30 uppercase tracking-wider mb-6">
                        {filteredScrolls.length} feed{filteredScrolls.length !== 1 ? 's' : ''}
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                )}

                {/* Results */}
                {isLoadingFeeds ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-24 bg-base-content/[0.02] rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredScrolls.length > 0 ? (
                    <div className="space-y-3">
                        {filteredScrolls.map((scroll) => (
                            <Link
                                key={scroll._id}
                                to={`/scroll/${scroll._id}`}
                                className="group block p-5 rounded-xl border border-base-content/5 hover:border-base-content/10 hover:bg-base-content/[0.02] transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-base-content/5 flex items-center justify-center shrink-0">
                                        <Filter className="w-5 h-5 text-base-content/30" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-medium text-base-content group-hover:text-base-content/80 truncate">
                                            {scroll.name}
                                        </h3>
                                        <p className="text-sm text-base-content/40 mt-0.5">
                                            by @{scroll.creator?.userName}
                                        </p>
                                        {scroll.description && (
                                            <p className="text-sm text-base-content/30 mt-2 line-clamp-2">
                                                {scroll.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <Filter className="w-12 h-12 mx-auto text-base-content/10 mb-4" strokeWidth={1} />
                        <h3 className="text-lg font-medium text-base-content/60 mb-2">
                            {searchQuery ? 'No feeds found' : 'No public feeds yet'}
                        </h3>
                        <p className="text-sm text-base-content/30">
                            {searchQuery
                                ? 'Try a different search term'
                                : 'Be the first to create a public feed'
                            }
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BrowseScrollsPage;
