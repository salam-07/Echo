import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useScrollStore } from '../store/useScrollStore';
import { Filter, Plus, Trash2, Lock, Search, ArrowLeft, Settings } from 'lucide-react';

const FeedScrollsPage = () => {
    const { scrolls, isLoadingScrolls, getScrolls, deleteScroll, isDeletingScroll } = useScrollStore();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    const feedScrolls = useMemo(() => {
        const feeds = scrolls.filter(scroll => scroll.type === 'feed');
        if (!searchQuery.trim()) return feeds;

        const query = searchQuery.toLowerCase();
        return feeds.filter(scroll =>
            scroll.name.toLowerCase().includes(query) ||
            scroll.description?.toLowerCase().includes(query)
        );
    }, [scrolls, searchQuery]);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleDelete = async (e, scrollId, scrollName) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`Delete "${scrollName}"?`)) {
            await deleteScroll(scrollId);
        }
    };

    const FeedScrollItem = ({ scroll }) => (
        <Link
            to={`/scroll/${scroll._id}`}
            className="group block py-4 border-b border-base-content/5 last:border-0"
        >
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-base-content/5 flex items-center justify-center shrink-0">
                    <Filter className="w-4 h-4 text-base-content/30" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {scroll.isPrivate && (
                            <Lock className="w-3 h-3 text-base-content/30" />
                        )}
                        <h3 className="font-medium text-base-content group-hover:text-base-content/70 truncate transition-colors">
                            {scroll.name}
                        </h3>
                    </div>
                    {scroll.description && (
                        <p className="text-sm text-base-content/40 mt-0.5 line-clamp-1">
                            {scroll.description}
                        </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-base-content/30">
                            Feed
                        </span>
                        <span className="text-xs text-base-content/20">
                            Created {new Date(scroll.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        to={`/scroll/${scroll._id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg text-base-content/30 hover:text-base-content/60 hover:bg-base-content/5 transition-colors"
                        title="Edit"
                    >
                        <Settings className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={(e) => handleDelete(e, scroll._id, scroll.name)}
                        disabled={isDeletingScroll}
                        className="p-2 rounded-lg text-base-content/20 hover:text-error/70 hover:bg-error/5 transition-colors disabled:opacity-50"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Link>
    );

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        to="/scrolls"
                        className="inline-flex items-center gap-1 text-sm text-base-content/40 hover:text-base-content mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Scrolls
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
                                Feed Scrolls
                            </h1>
                            <p className="text-base-content/40">
                                Automated content feeds and discovery
                            </p>
                        </div>
                        <Link
                            to="/scroll/new?type=feed"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-base-content text-base-100 rounded-full text-sm font-medium hover:bg-base-content/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Feed
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                        <input
                            type="text"
                            placeholder="Search your feeds..."
                            className="w-full h-12 pl-11 pr-4 bg-base-content/[0.03] border-0 rounded-xl text-base-content placeholder:text-base-content/30 focus:outline-none focus:ring-2 focus:ring-base-content/10"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {/* Results count */}
                {!isLoadingScrolls && (
                    <p className="text-xs text-base-content/30 uppercase tracking-wider mb-6">
                        {feedScrolls.length} feed{feedScrolls.length !== 1 ? 's' : ''}
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                )}

                {/* Loading State */}
                {isLoadingScrolls && (
                    <div className="border border-base-content/5 rounded-xl overflow-hidden">
                        <div className="divide-y divide-base-content/5 px-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="py-4 animate-pulse">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-base-content/5 rounded-lg" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-base-content/5 rounded w-1/3 mb-2" />
                                            <div className="h-3 bg-base-content/5 rounded w-2/3 mb-2" />
                                            <div className="h-2.5 bg-base-content/5 rounded w-1/4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feed Scrolls List */}
                {!isLoadingScrolls && (
                    <>
                        {feedScrolls.length > 0 ? (
                            <div className="border border-base-content/5 rounded-xl overflow-hidden">
                                <div className="divide-y divide-base-content/5 px-4">
                                    {feedScrolls.map((scroll) => (
                                        <FeedScrollItem key={scroll._id} scroll={scroll} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <Filter className="w-12 h-12 mx-auto text-base-content/10 mb-4" strokeWidth={1} />
                                <h3 className="text-lg font-medium text-base-content/60 mb-2">
                                    {searchQuery ? 'No feeds found' : 'No feed scrolls yet'}
                                </h3>
                                <p className="text-sm text-base-content/30 mb-8">
                                    {searchQuery
                                        ? 'Try a different search term'
                                        : 'Create your first feed scroll to automate content discovery'
                                    }
                                </p>
                                {!searchQuery && (
                                    <Link
                                        to="/scroll/new?type=feed"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-base-content text-base-100 rounded-full text-sm font-medium hover:bg-base-content/90 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Feed
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default FeedScrollsPage;