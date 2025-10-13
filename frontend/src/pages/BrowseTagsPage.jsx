import { useEffect, useState } from 'react';
import { Search, Hash, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCommunityStore from '../store/useCommunityStore';
import Layout from '../layouts/Layout';

const BrowseTagsPage = () => {
    const {
        tags,
        isLoadingTags,
        fetchTags
    } = useCommunityStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTags, setFilteredTags] = useState([]);
    const [sortBy, setSortBy] = useState('popular'); // 'popular', 'alphabetical', 'recent'

    useEffect(() => {
        fetchTags(); // Fetch all tags without limit
    }, [fetchTags]);

    useEffect(() => {
        let filtered = tags;

        if (searchQuery.trim()) {
            filtered = tags.filter(tag =>
                tag.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort tags
        switch (sortBy) {
            case 'alphabetical':
                filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'recent':
                filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default: // popular
                filtered = filtered.sort((a, b) => (b.count || 0) - (a.count || 0));
        }

        setFilteredTags(filtered);
    }, [searchQuery, tags, sortBy]);

    const getTagSize = (count) => {
        if (count > 100) return 'text-2xl';
        if (count > 50) return 'text-xl';
        if (count > 25) return 'text-lg';
        if (count > 10) return 'text-base';
        return 'text-sm';
    };

    const getTagColor = (count) => {
        if (count > 100) return 'badge-error';
        if (count > 50) return 'badge-warning';
        if (count > 25) return 'badge-info';
        if (count > 10) return 'badge-success';
        return 'badge-ghost';
    };

    const TagCard = ({ tag }) => (
        <Link
            to={`/tag/${tag.name}`}
            className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
        >
            <div className="card-body p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                    <Hash className="w-6 h-6 text-primary mr-2" />
                    <h3 className={`font-bold text-primary ${getTagSize(tag.count)}`}>
                        {tag.name}
                    </h3>
                </div>
                <div className="space-y-2">
                    <div className={`badge ${getTagColor(tag.count)} badge-lg gap-2`}>
                        <TrendingUp className="w-3 h-3" />
                        {tag.count || 0} echo{(tag.count || 0) !== 1 ? 's' : ''}
                    </div>
                    {tag.recentEchosCount && (
                        <p className="text-xs text-base-content/60">
                            {tag.recentEchosCount} this week
                        </p>
                    )}
                </div>
                {tag.description && (
                    <p className="text-sm text-base-content/70 mt-3 line-clamp-2">
                        {tag.description}
                    </p>
                )}
            </div>
        </Link>
    );

    const TagCloud = ({ tags }) => (
        <div className="flex flex-wrap gap-3 justify-center">
            {tags.map((tag) => (
                <Link
                    key={tag._id}
                    to={`/tag/${tag.name}`}
                    className={`badge badge-outline hover:badge-primary transition-colors cursor-pointer ${getTagSize(tag.count)} px-3 py-2`}
                >
                    #{tag.name}
                    <span className="ml-2 text-xs opacity-60">
                        ({tag.count || 0})
                    </span>
                </Link>
            ))}
        </div>
    );

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <div className="skeleton w-6 h-6 rounded mr-2"></div>
                            <div className="skeleton h-6 w-20"></div>
                        </div>
                        <div className="skeleton h-8 w-24 mx-auto mb-2"></div>
                        <div className="skeleton h-3 w-16 mx-auto"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Layout>
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Browse Tags</h1>
                    <p className="text-base-content/70">
                        Discover trending topics and explore content by tags
                    </p>
                </div>

                {/* Search and Sort */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search tags..."
                                    className="input input-bordered w-full pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <select
                            className="select select-bordered"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popular">Most Popular</option>
                            <option value="alphabetical">A-Z</option>
                            <option value="recent">Recently Added</option>
                        </select>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="tabs tabs-boxed">
                        <button
                            className={`tab ${sortBy !== 'cloud' ? 'tab-active' : ''}`}
                            onClick={() => setSortBy('popular')}
                        >
                            Card View
                        </button>
                        <button
                            className={`tab ${sortBy === 'cloud' ? 'tab-active' : ''}`}
                            onClick={() => setSortBy('cloud')}
                        >
                            Cloud View
                        </button>
                    </div>
                </div>

                {/* Results */}
                {isLoadingTags ? (
                    <LoadingSkeleton />
                ) : filteredTags.length > 0 ? (
                    <>
                        <div className="mb-6">
                            <p className="text-sm text-base-content/60 text-center">
                                {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''} found
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                        </div>

                        {sortBy === 'cloud' ? (
                            <TagCloud tags={filteredTags} />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredTags.map((tag) => (
                                    <TagCard key={tag._id} tag={tag} />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Hash className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            {searchQuery ? 'No tags found' : 'No tags yet'}
                        </h3>
                        <p className="text-base-content/60">
                            {searchQuery
                                ? 'Try a different search term'
                                : 'Tags will appear here as people start using them in their echos'
                            }
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BrowseTagsPage;