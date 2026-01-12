import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useScrollStore } from '../store/useScrollStore';
import useAuthStore from '../store/useAuthStore';
import { FollowButton } from '../components/features/scroll';
import { Filter, Layers, Plus, Trash2, Lock, ArrowRight } from 'lucide-react';

const ScrollsPage = () => {
    const { scrolls, isLoadingScrolls, getScrolls, deleteScroll, isDeletingScroll } = useScrollStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    // Memoized scroll categorization
    const { ownedFeeds, ownedCurations, followedFeeds, followedCurations } = useMemo(() => {
        const owned = scrolls.filter(scroll => scroll.creator._id === authUser?._id);
        const followed = scrolls.filter(scroll => scroll.creator._id !== authUser?._id);

        return {
            ownedFeeds: owned.filter(s => s.type === 'feed'),
            ownedCurations: owned.filter(s => s.type === 'curation'),
            followedFeeds: followed.filter(s => s.type === 'feed'),
            followedCurations: followed.filter(s => s.type === 'curation'),
        };
    }, [scrolls, authUser?._id]);

    const totalOwned = ownedFeeds.length + ownedCurations.length;
    const totalFollowed = followedFeeds.length + followedCurations.length;

    const handleDelete = async (e, scrollId, scrollName) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`Delete "${scrollName}"?`)) {
            await deleteScroll(scrollId);
        }
    };

    const ScrollItem = ({ scroll, showDelete = false, showFollow = false }) => (
        <Link
            to={`/scroll/${scroll._id}`}
            className="group block py-4 border-b border-base-content/5 last:border-0"
        >
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${scroll.type === 'feed' ? 'bg-base-content/5' : 'bg-base-content/5'
                    }`}>
                    {scroll.type === 'feed' ? (
                        <Filter className="w-4 h-4 text-base-content/30" />
                    ) : (
                        <Layers className="w-4 h-4 text-base-content/30" />
                    )}
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
                            {scroll.type === 'feed' ? 'Feed' : `${scroll.echos?.length || 0} echos`}
                        </span>
                        {scroll.creator._id !== authUser?._id && (
                            <span className="text-xs text-base-content/30">
                                by @{scroll.creator?.userName}
                            </span>
                        )}
                    </div>
                </div>
                {showFollow && (
                    <FollowButton scroll={scroll} size="sm" />
                )}
                {showDelete && (
                    <button
                        onClick={(e) => handleDelete(e, scroll._id, scroll.name)}
                        disabled={isDeletingScroll}
                        className="p-2 rounded-lg text-base-content/20 hover:text-error/70 hover:bg-error/5 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </Link>
    );

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="flex items-start justify-between mb-12">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
                            Scrolls
                        </h1>
                        <p className="text-base-content/40">
                            Your feeds and curations
                        </p>
                    </div>
                    <Link
                        to="/scroll/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-base-content text-base-100 rounded-full text-sm font-medium hover:bg-base-content/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New
                    </Link>
                </div>

                {/* Loading */}
                {isLoadingScrolls && (
                    <div className="space-y-0">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="py-4 border-b border-base-content/5 animate-pulse">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-base-content/5 rounded-lg" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-base-content/5 rounded w-1/3 mb-2" />
                                        <div className="h-3 bg-base-content/5 rounded w-2/3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoadingScrolls && scrolls.length === 0 && (
                    <div className="py-20 text-center">
                        <Layers className="w-12 h-12 mx-auto text-base-content/10 mb-4" strokeWidth={1} />
                        <h3 className="text-lg font-medium text-base-content/60 mb-2">
                            No scrolls yet
                        </h3>
                        <p className="text-sm text-base-content/30 mb-8">
                            Create your first scroll to organize echos
                        </p>
                        <Link
                            to="/scroll/new"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-base-content text-base-100 rounded-full text-sm font-medium hover:bg-base-content/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create Scroll
                        </Link>
                    </div>
                )}

                {/* Content */}
                {!isLoadingScrolls && scrolls.length > 0 && (
                    <div className="space-y-12">
                        {/* My Scrolls */}
                        {totalOwned > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xs font-medium text-base-content/30 uppercase tracking-wider">
                                        My Scrolls
                                    </h2>
                                    <span className="text-xs text-base-content/20">
                                        {totalOwned}
                                    </span>
                                </div>

                                {/* Feeds */}
                                {ownedFeeds.length > 0 && (
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Filter className="w-4 h-4 text-base-content/20" />
                                            <span className="text-sm font-medium text-base-content/50">
                                                Feeds
                                            </span>
                                        </div>
                                        <div className="border border-base-content/5 rounded-xl overflow-hidden">
                                            <div className="divide-y divide-base-content/5 px-4">
                                                {ownedFeeds.map(scroll => (
                                                    <ScrollItem key={scroll._id} scroll={scroll} showDelete />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Curations */}
                                {ownedCurations.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Layers className="w-4 h-4 text-base-content/20" />
                                            <span className="text-sm font-medium text-base-content/50">
                                                Curations
                                            </span>
                                        </div>
                                        <div className="border border-base-content/5 rounded-xl overflow-hidden">
                                            <div className="divide-y divide-base-content/5 px-4">
                                                {ownedCurations.map(scroll => (
                                                    <ScrollItem key={scroll._id} scroll={scroll} showDelete />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Following */}
                        {totalFollowed > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xs font-medium text-base-content/30 uppercase tracking-wider">
                                        Following
                                    </h2>
                                    <span className="text-xs text-base-content/20">
                                        {totalFollowed}
                                    </span>
                                </div>

                                {/* Followed Feeds */}
                                {followedFeeds.length > 0 && (
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Filter className="w-4 h-4 text-base-content/20" />
                                            <span className="text-sm font-medium text-base-content/50">
                                                Feeds
                                            </span>
                                        </div>
                                        <div className="border border-base-content/5 rounded-xl overflow-hidden">
                                            <div className="divide-y divide-base-content/5 px-4">
                                                {followedFeeds.map(scroll => (
                                                    <ScrollItem key={scroll._id} scroll={scroll} showFollow />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Followed Curations */}
                                {followedCurations.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Layers className="w-4 h-4 text-base-content/20" />
                                            <span className="text-sm font-medium text-base-content/50">
                                                Curations
                                            </span>
                                        </div>
                                        <div className="border border-base-content/5 rounded-xl overflow-hidden">
                                            <div className="divide-y divide-base-content/5 px-4">
                                                {followedCurations.map(scroll => (
                                                    <ScrollItem key={scroll._id} scroll={scroll} showFollow />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Discover More */}
                        <div className="pt-4 border-t border-base-content/5">
                            <Link
                                to="/community"
                                className="flex items-center justify-between py-3 text-sm text-base-content/40 hover:text-base-content transition-colors"
                            >
                                <span>Discover more scrolls</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ScrollsPage;
