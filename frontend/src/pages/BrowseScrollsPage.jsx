import { useEffect, useState } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import useCommunityStore from '../store/useCommunityStore';
import Layout from '../layouts/Layout';
import FeedScrollCard from '../components/features/scroll/FeedScrollCard';

const BrowseScrollsPage = () => {
    const {
        feedScrolls,
        isLoadingFeeds,
        fetchPublicFeedScrolls
    } = useCommunityStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredScrolls, setFilteredScrolls] = useState([]);

    useEffect(() => {
        fetchPublicFeedScrolls(); // Fetch all without limit
    }, [fetchPublicFeedScrolls]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = feedScrolls.filter(scroll =>
                scroll.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scroll.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scroll.creator?.userName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredScrolls(filtered);
        } else {
            setFilteredScrolls(feedScrolls);
        }
    }, [searchQuery, feedScrolls]);



    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="skeleton h-6 w-32"></div>
                            <div className="skeleton w-4 h-4 rounded"></div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="skeleton w-6 h-6 rounded-full"></div>
                            <div className="skeleton h-4 w-20"></div>
                        </div>
                        <div className="skeleton h-4 w-full mb-2"></div>
                        <div className="skeleton h-4 w-3/4 mb-4"></div>
                        <div className="flex gap-4 mb-4">
                            <div className="skeleton h-3 w-16"></div>
                            <div className="skeleton h-3 w-20"></div>
                            <div className="skeleton h-3 w-24"></div>
                        </div>
                        <div className="flex justify-end">
                            <div className="skeleton h-8 w-20 rounded-md"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Layout>
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Browse Feed Scrolls</h1>
                    <p className="text-base-content/70">
                        Discover and follow public feed scrolls from the community
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search scrolls, creators, descriptions..."
                                    className="input input-bordered w-full pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="btn btn-outline gap-2">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Results */}
                {isLoadingFeeds ? (
                    <LoadingSkeleton />
                ) : filteredScrolls.length > 0 ? (
                    <>
                        <div className="mb-4">
                            <p className="text-sm text-base-content/60">
                                {filteredScrolls.length} scroll{filteredScrolls.length !== 1 ? 's' : ''} found
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredScrolls.map((scroll) => (
                                <FeedScrollCard key={scroll._id} scroll={scroll} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Users className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            {searchQuery ? 'No scrolls found' : 'No public feed scrolls yet'}
                        </h3>
                        <p className="text-base-content/60">
                            {searchQuery
                                ? 'Try adjusting your search terms'
                                : 'Be the first to create a public feed scroll!'
                            }
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BrowseScrollsPage;
