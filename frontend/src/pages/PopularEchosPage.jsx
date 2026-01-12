import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, TrendingUp, ArrowLeft } from 'lucide-react';
import useCommunityStore from '../store/useCommunityStore';
import EchoCard from '../components/features/echo/EchoCard';
import Layout from '../layouts/Layout';

const PopularEchosPage = () => {
    const {
        popularEchos,
        isLoadingPopularEchos,
        fetchPopularEchos
    } = useCommunityStore();

    const [timeFilter, setTimeFilter] = useState('all');

    useEffect(() => {
        fetchPopularEchos();
    }, [fetchPopularEchos, timeFilter]);

    // Time filter buttons
    const timeFilters = useMemo(() => [
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'all', label: 'All Time' },
    ], []);

    const handleTimeFilterChange = useCallback((filter) => {
        setTimeFilter(filter);
    }, []);

    // Memoized stats
    const stats = useMemo(() => {
        if (!popularEchos.length) return null;
        return {
            total: popularEchos.length,
            totalLikes: popularEchos.reduce((sum, echo) => sum + (echo.likes || echo.likedBy?.length || 0), 0),
        };
    }, [popularEchos]);

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
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
                        Trending
                    </h1>
                    <p className="text-base-content/40">
                        The most liked echos from the community
                    </p>
                </div>

                {/* Time Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {timeFilters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => handleTimeFilterChange(filter.id)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${timeFilter === filter.id
                                    ? 'bg-base-content text-base-100'
                                    : 'text-base-content/50 border border-base-content/10 hover:border-base-content/20 hover:text-base-content/70'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                {stats && !isLoadingPopularEchos && (
                    <div className="flex gap-8 mb-8 pb-8 border-b border-base-content/5">
                        <div>
                            <div className="text-2xl font-semibold text-base-content">
                                {stats.total}
                            </div>
                            <div className="text-xs text-base-content/30 uppercase tracking-wider">
                                Echos
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-semibold text-base-content flex items-center gap-2">
                                <Heart className="w-5 h-5 text-base-content/30" />
                                {stats.totalLikes}
                            </div>
                            <div className="text-xs text-base-content/30 uppercase tracking-wider">
                                Total Likes
                            </div>
                        </div>
                    </div>
                )}

                {/* Echos List */}
                {isLoadingPopularEchos ? (
                    <div className="space-y-0">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="py-6 border-b border-base-content/5 animate-pulse">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-base-content/5 rounded" />
                                    <div className="flex-1">
                                        <div className="h-3 bg-base-content/5 rounded w-1/4 mb-3" />
                                        <div className="h-4 bg-base-content/5 rounded w-full mb-2" />
                                        <div className="h-4 bg-base-content/5 rounded w-3/4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : popularEchos.length > 0 ? (
                    <div className="space-y-0">
                        {popularEchos.map((echo, index) => (
                            <div key={echo._id} className="relative">
                                {/* Rank indicator */}
                                {index < 3 && (
                                    <div className="absolute -left-8 top-6 hidden sm:flex items-center justify-center w-6 h-6">
                                        <span className="text-lg font-bold text-base-content/10">
                                            {index + 1}
                                        </span>
                                    </div>
                                )}
                                <EchoCard echo={echo} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <TrendingUp className="w-12 h-12 mx-auto text-base-content/10 mb-4" strokeWidth={1} />
                        <h3 className="text-lg font-medium text-base-content/60 mb-2">
                            No trending echos yet
                        </h3>
                        <p className="text-sm text-base-content/30">
                            {timeFilter !== 'all'
                                ? 'Try a different time period'
                                : 'Be the first to create engaging content'
                            }
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PopularEchosPage;