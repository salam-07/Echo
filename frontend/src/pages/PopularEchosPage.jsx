import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share, Calendar, TrendingUp, Filter } from 'lucide-react';
import useCommunityStore from '../store/useCommunityStore';
import EchoCard from '../components/EchoCard';
import Layout from '../layouts/Layout';

const PopularEchosPage = () => {
    const {
        popularEchos,
        isLoadingPopularEchos,
        fetchPopularEchos
    } = useCommunityStore();

    const [timeFilter, setTimeFilter] = useState('today'); // 'today', 'week', 'month', 'all'
    const [sortBy, setSortBy] = useState('likes'); // 'likes', 'comments', 'recent'

    useEffect(() => {
        fetchPopularEchos(); // Fetch all popular echos
    }, [fetchPopularEchos, timeFilter]);

    const PopularEchoCard = ({ echo, rank }) => (
        <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
            <div className="card-body p-6">
                <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0">
                        <div className={`badge badge-lg font-bold ${rank <= 3 ? 'badge-warning' :
                            rank <= 10 ? 'badge-info' :
                                'badge-ghost'
                            }`}>
                            #{rank}
                        </div>
                    </div>

                    {/* Author Avatar */}
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-12 h-12">
                            <span className="text-sm font-medium">
                                {echo.author?.username?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">@{echo.author?.username}</span>
                            <span className="text-sm text-base-content/60">
                                {new Date(echo.createdAt).toLocaleDateString()}
                            </span>
                            {rank <= 3 && (
                                <div className="badge badge-warning badge-sm">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Trending
                                </div>
                            )}
                        </div>

                        <p className="text-base mb-4 leading-relaxed">
                            {echo.content}
                        </p>

                        {/* Tags */}
                        {echo.tags && echo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                                {echo.tags.map((tag) => (
                                    <span key={tag} className="badge badge-outline badge-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-base-content/70">
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-500" />
                                <span className="font-medium">{echo.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-blue-500" />
                                <span>{echo.comments?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Share className="w-4 h-4 text-green-500" />
                                <span>{echo.shares || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const LoadingSkeleton = () => (
        <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-6">
                        <div className="flex items-start gap-4">
                            <div className="skeleton w-8 h-6 rounded-full"></div>
                            <div className="skeleton w-12 h-12 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="skeleton h-4 w-20"></div>
                                    <div className="skeleton h-4 w-24"></div>
                                </div>
                                <div className="skeleton h-4 w-full"></div>
                                <div className="skeleton h-4 w-3/4"></div>
                                <div className="flex gap-6 mt-4">
                                    <div className="skeleton h-4 w-16"></div>
                                    <div className="skeleton h-4 w-16"></div>
                                    <div className="skeleton h-4 w-16"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const getTimeFilterText = () => {
        switch (timeFilter) {
            case 'today': return "Today's";
            case 'week': return "This Week's";
            case 'month': return "This Month's";
            case 'all': return "All Time";
            default: return "Today's";
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{getTimeFilterText()} Popular Echos</h1>
                    <p className="text-base-content/70">
                        Discover the most liked and engaging content from the Echo community
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex gap-2">
                            <div className="join">
                                <button
                                    className={`btn btn-sm join-item ${timeFilter === 'today' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setTimeFilter('today')}
                                >
                                    Today
                                </button>
                                <button
                                    className={`btn btn-sm join-item ${timeFilter === 'week' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setTimeFilter('week')}
                                >
                                    This Week
                                </button>
                                <button
                                    className={`btn btn-sm join-item ${timeFilter === 'month' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setTimeFilter('month')}
                                >
                                    This Month
                                </button>
                                <button
                                    className={`btn btn-sm join-item ${timeFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setTimeFilter('all')}
                                >
                                    All Time
                                </button>
                            </div>
                        </div>

                        <select
                            className="select select-bordered select-sm"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="likes">Most Liked</option>
                            <option value="comments">Most Commented</option>
                            <option value="shares">Most Shared</option>
                            <option value="recent">Most Recent</option>
                        </select>
                    </div>
                </div>

                {/* Popular Echos List */}
                {isLoadingPopularEchos ? (
                    <LoadingSkeleton />
                ) : popularEchos.length > 0 ? (
                    <div className="space-y-6">
                        {popularEchos.map((echo, index) => (
                            <PopularEchoCard
                                key={echo._id}
                                echo={echo}
                                rank={index + 1}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <TrendingUp className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            No popular echos {timeFilter !== 'all' ? getTimeFilterText().toLowerCase() : 'yet'}
                        </h3>
                        <p className="text-base-content/60">
                            {timeFilter === 'today'
                                ? 'Check back later or try a different time period'
                                : 'Be the first to create engaging content!'
                            }
                        </p>
                    </div>
                )}

                {/* Stats Summary */}
                {popularEchos.length > 0 && (
                    <div className="mt-12 p-6 bg-base-200 rounded-box">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {getTimeFilterText()} Summary
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-primary">
                                    {popularEchos.length}
                                </div>
                                <div className="text-sm text-base-content/60">Popular Echos</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-red-500">
                                    {popularEchos.reduce((sum, echo) => sum + (echo.likes?.length || 0), 0)}
                                </div>
                                <div className="text-sm text-base-content/60">Total Likes</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-500">
                                    {popularEchos.reduce((sum, echo) => sum + (echo.comments?.length || 0), 0)}
                                </div>
                                <div className="text-sm text-base-content/60">Total Comments</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-500">
                                    {popularEchos.reduce((sum, echo) => sum + (echo.shares || 0), 0)}
                                </div>
                                <div className="text-sm text-base-content/60">Total Shares</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PopularEchosPage;