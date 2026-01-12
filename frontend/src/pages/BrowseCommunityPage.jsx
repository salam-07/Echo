import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, Layers, Hash, TrendingUp, Heart } from 'lucide-react';
import useCommunityStore from '../store/useCommunityStore';
import { FollowButton } from '../components/features/scroll';
import Layout from '../layouts/Layout';

const BrowseCommunityPage = () => {
    const {
        feedScrolls,
        curationScrolls,
        tags,
        popularEchos,
        isLoadingFeeds,
        isLoadingCurations,
        isLoadingTags,
        isLoadingPopularEchos,
        fetchPublicFeedScrolls,
        fetchPublicCurationScrolls,
        fetchTags,
        fetchPopularEchos
    } = useCommunityStore();

    useEffect(() => {
        fetchPublicFeedScrolls(4);
        fetchPublicCurationScrolls(4);
        fetchTags(12);
        fetchPopularEchos(5);
    }, [fetchPublicFeedScrolls, fetchPublicCurationScrolls, fetchTags, fetchPopularEchos]);

    // Memoized data
    const topTags = useMemo(() => tags.slice(0, 12), [tags]);
    const topEchos = useMemo(() => popularEchos.slice(0, 5), [popularEchos]);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                {/* Hero Header */}
                <div className="mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-base-content tracking-tight mb-4">
                        Explore
                    </h1>
                    <p className="text-lg text-base-content/40 max-w-lg">
                        Discover scrolls, trending topics, and popular content from the community
                    </p>
                </div>

                {/* Feed Scrolls Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-base-content/5 flex items-center justify-center">
                                <Filter className="w-4 h-4 text-base-content/40" />
                            </div>
                            <h2 className="text-xl font-semibold text-base-content">Feeds</h2>
                        </div>
                        <Link
                            to="/browse/scrolls"
                            className="flex items-center gap-1 text-sm text-base-content/40 hover:text-base-content transition-colors"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {isLoadingFeeds ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-24 bg-base-content/[0.02] rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : feedScrolls.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {feedScrolls.map((scroll) => (
                                <Link
                                    key={scroll._id}
                                    to={`/scroll/${scroll._id}`}
                                    className="group p-4 rounded-xl border border-base-content/5 hover:border-base-content/10 hover:bg-base-content/[0.02] transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-base-content/5 flex items-center justify-center shrink-0">
                                            <Filter className="w-5 h-5 text-base-content/30" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-base-content group-hover:text-base-content/80 truncate">
                                                        {scroll.name}
                                                    </h3>
                                                    <p className="text-sm text-base-content/40 mt-0.5">
                                                        by @{scroll.creator?.userName}
                                                    </p>
                                                </div>
                                                <FollowButton scroll={scroll} size="xs" />
                                            </div>
                                            {scroll.description && (
                                                <p className="text-sm text-base-content/30 mt-2 line-clamp-1">
                                                    {scroll.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-12 text-base-content/30 text-sm">
                            No public feeds yet
                        </p>
                    )}
                </section>

                {/* Curation Scrolls Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-base-content/5 flex items-center justify-center">
                                <Layers className="w-4 h-4 text-base-content/40" />
                            </div>
                            <h2 className="text-xl font-semibold text-base-content">Curations</h2>
                        </div>
                        <Link
                            to="/browse/curation"
                            className="flex items-center gap-1 text-sm text-base-content/40 hover:text-base-content transition-colors"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {isLoadingCurations ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-24 bg-base-content/[0.02] rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : curationScrolls.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {curationScrolls.map((scroll) => (
                                <Link
                                    key={scroll._id}
                                    to={`/scroll/${scroll._id}`}
                                    className="group p-4 rounded-xl border border-base-content/5 hover:border-base-content/10 hover:bg-base-content/[0.02] transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-base-content/5 flex items-center justify-center shrink-0">
                                            <Layers className="w-5 h-5 text-base-content/30" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-base-content group-hover:text-base-content/80 truncate">
                                                        {scroll.name}
                                                    </h3>
                                                    <p className="text-sm text-base-content/40 mt-0.5">
                                                        {scroll.echos?.length || 0} echos • @{scroll.creator?.userName}
                                                    </p>
                                                </div>
                                                <FollowButton scroll={scroll} size="xs" />
                                            </div>
                                            {scroll.description && (
                                                <p className="text-sm text-base-content/30 mt-2 line-clamp-1">
                                                    {scroll.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-12 text-base-content/30 text-sm">
                            No public curations yet
                        </p>
                    )}
                </section>

                {/* Tags Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-base-content/5 flex items-center justify-center">
                                <Hash className="w-4 h-4 text-base-content/40" />
                            </div>
                            <h2 className="text-xl font-semibold text-base-content">Trending Tags</h2>
                        </div>
                        <Link
                            to="/browse/tags"
                            className="flex items-center gap-1 text-sm text-base-content/40 hover:text-base-content transition-colors"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {isLoadingTags ? (
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="h-8 w-20 bg-base-content/[0.02] rounded-full animate-pulse" />
                            ))}
                        </div>
                    ) : topTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {topTags.map((tag) => (
                                <Link
                                    key={tag._id}
                                    to={`/tag/${tag.name}`}
                                    className="px-4 py-2 rounded-full border border-base-content/10 text-sm text-base-content/60 hover:text-base-content hover:border-base-content/20 transition-all"
                                >
                                    #{tag.name}
                                    <span className="ml-2 text-base-content/30">{tag.count || 0}</span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-12 text-base-content/30 text-sm">
                            No tags yet
                        </p>
                    )}
                </section>

                {/* Popular Echos Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-base-content/5 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-base-content/40" />
                            </div>
                            <h2 className="text-xl font-semibold text-base-content">Trending</h2>
                        </div>
                        <Link
                            to="/browse/popular"
                            className="flex items-center gap-1 text-sm text-base-content/40 hover:text-base-content transition-colors"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {isLoadingPopularEchos ? (
                        <div className="space-y-0 divide-y divide-base-content/5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="py-4 animate-pulse">
                                    <div className="h-3 bg-base-content/5 rounded w-1/4 mb-2" />
                                    <div className="h-4 bg-base-content/5 rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : topEchos.length > 0 ? (
                        <div className="space-y-0 divide-y divide-base-content/5">
                            {topEchos.map((echo, index) => (
                                <Link
                                    key={echo._id}
                                    to={`/echo/${echo._id}`}
                                    className="group block py-4 first:pt-0"
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="text-2xl font-bold text-base-content/10 w-8 shrink-0">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-base-content/40 mb-1">
                                                @{echo.author?.userName}
                                            </p>
                                            <p className="text-base-content group-hover:text-base-content/70 transition-colors line-clamp-2">
                                                {echo.content}
                                            </p>
                                            <div className="flex items-center gap-1 mt-2 text-xs text-base-content/30">
                                                <Heart className="w-3 h-3" />
                                                <span>{echo.likes || echo.likedBy?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-12 text-base-content/30 text-sm">
                            No trending echos yet
                        </p>
                    )}
                </section>
            </div>
        </Layout>
    );
};

export default BrowseCommunityPage;