import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Hash, Heart, Users } from 'lucide-react';
import useCommunityStore from '../store/useCommunityStore';
import Layout from '../layouts/Layout';
import { FeedScrollCard, CurationScrollCard } from '../components/features/scroll';

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
        // Fetch limited data for preview
        fetchPublicFeedScrolls(4);
        fetchPublicCurationScrolls(4);
        fetchTags(8);
        fetchPopularEchos(3);
    }, [fetchPublicFeedScrolls, fetchPublicCurationScrolls, fetchTags, fetchPopularEchos]);

    const SectionHeader = ({ icon: Icon, title, linkTo, linkText }) => (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            <Link
                to={linkTo}
                className="btn btn-ghost btn-sm gap-2 text-primary hover:bg-primary/10"
            >
                {linkText}
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );



    const TagPill = ({ tag }) => (
        <Link
            to={`/tag/${tag.name}`}
            className="badge badge-outline badge-md hover:badge-primary transition-colors"
        >
            #{tag.name}
            <span className="ml-1 text-xs opacity-60">({tag.count || 0})</span>
        </Link>
    );

    const EchoCard = ({ echo }) => (
        <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
            <div className="card-body p-4">
                <div className="flex items-start gap-3">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                            <span className="text-xs">
                                {echo.author?.userName?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">@{echo.author?.userName}</span>
                            <span className="text-xs text-base-content/50">
                                {new Date(echo.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm line-clamp-3">{echo.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
                            <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{echo.likes?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const LoadingSkeleton = ({ count = 4, type = 'card' }) => {
        if (type === 'tags') {
            return (
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="skeleton h-6 w-20 rounded-full"></div>
                    ))}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-4">
                            <div className="skeleton h-4 w-3/4 mb-2"></div>
                            <div className="skeleton h-3 w-1/2 mb-2"></div>
                            <div className="skeleton h-3 w-full"></div>
                            <div className="skeleton h-3 w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Layout>
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Discover Community</h1>
                    <p className="text-base-content/70">
                        Explore public scrolls, trending tags, and popular content from the Echo community
                    </p>
                </div>

                {/* Feed Scrolls Section */}
                <div className="mb-8">
                    <SectionHeader
                        icon={Users}
                        title="Feed Scrolls"
                        linkTo="/browse/scrolls"
                        linkText="Browse All"
                    />
                    {isLoadingFeeds ? (
                        <LoadingSkeleton count={4} />
                    ) : feedScrolls.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {feedScrolls.map((scroll) => (
                                <FeedScrollCard key={scroll._id} scroll={scroll} compact={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-base-content/60">
                            No public feed scrolls available yet
                        </div>
                    )}
                </div>

                {/* Curation Scrolls Section */}
                <div className="mb-8">
                    <SectionHeader
                        icon={BookOpen}
                        title="Curation Scrolls"
                        linkTo="/browse/curation"
                        linkText="Browse All"
                    />
                    {isLoadingCurations ? (
                        <LoadingSkeleton count={4} />
                    ) : curationScrolls.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {curationScrolls.map((scroll) => (
                                <CurationScrollCard key={scroll._id} scroll={scroll} compact={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-base-content/60">
                            No public curation scrolls available yet
                        </div>
                    )}
                </div>

                {/* Tags Section */}
                <div className="mb-8">
                    <SectionHeader
                        icon={Hash}
                        title="Trending Tags"
                        linkTo="/browse/tags"
                        linkText="Browse All"
                    />
                    {isLoadingTags ? (
                        <LoadingSkeleton count={8} type="tags" />
                    ) : tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <TagPill key={tag._id} tag={tag} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-base-content/60">
                            No tags available yet
                        </div>
                    )}
                </div>

                {/* Popular Echos Section */}
                <div className="mb-8">
                    <SectionHeader
                        icon={Heart}
                        title="Today's Popular Echos"
                        linkTo="/browse/popular"
                        linkText="See All"
                    />
                    {isLoadingPopularEchos ? (
                        <LoadingSkeleton count={3} />
                    ) : popularEchos.length > 0 ? (
                        <div className="space-y-4">
                            {popularEchos.map((echo) => (
                                <EchoCard key={echo._id} echo={echo} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-base-content/60">
                            No popular echos today
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default BrowseCommunityPage;