import { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, Hash, ArrowLeft } from 'lucide-react';
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
    const [sortBy, setSortBy] = useState('popular');

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    // Memoized sorted and filtered tags
    const filteredTags = useMemo(() => {
        let result = [...tags];

        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(tag =>
                tag.name.toLowerCase().includes(query)
            );
        }

        // Sort
        switch (sortBy) {
            case 'alphabetical':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'recent':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default: // popular
                result.sort((a, b) => (b.count || 0) - (a.count || 0));
        }

        return result;
    }, [searchQuery, tags, sortBy]);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleSortChange = useCallback((e) => {
        setSortBy(e.target.value);
    }, []);

    // Get tag size based on count for visual hierarchy
    const getTagWeight = (count) => {
        if (count > 50) return 'text-lg font-semibold';
        if (count > 20) return 'text-base font-medium';
        return 'text-sm';
    };

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
                        Tags
                    </h1>
                    <p className="text-base-content/40">
                        Discover topics and explore by tag
                    </p>
                </div>

                {/* Search & Sort */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                        <input
                            type="text"
                            placeholder="Search tags..."
                            className="w-full h-12 pl-11 pr-4 bg-base-content/[0.03] border-0 rounded-xl text-base-content placeholder:text-base-content/30 focus:outline-none focus:ring-2 focus:ring-base-content/10"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <select
                        className="h-12 px-4 bg-base-content/[0.03] border-0 rounded-xl text-base-content/70 focus:outline-none focus:ring-2 focus:ring-base-content/10 cursor-pointer"
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="popular">Most Popular</option>
                        <option value="alphabetical">A-Z</option>
                        <option value="recent">Recent</option>
                    </select>
                </div>

                {/* Results count */}
                {!isLoadingTags && (
                    <p className="text-xs text-base-content/30 uppercase tracking-wider mb-6">
                        {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''}
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                )}

                {/* Results */}
                {isLoadingTags ? (
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <div
                                key={i}
                                className="h-10 bg-base-content/[0.02] rounded-full animate-pulse"
                                style={{ width: `${60 + Math.random() * 60}px` }}
                            />
                        ))}
                    </div>
                ) : filteredTags.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {filteredTags.map((tag) => (
                            <Link
                                key={tag._id}
                                to={`/tag/${tag.name}`}
                                className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-base-content/10 hover:border-base-content/20 hover:bg-base-content/[0.03] transition-all ${getTagWeight(tag.count)}`}
                            >
                                <Hash className="w-3.5 h-3.5 text-base-content/30" />
                                <span className="text-base-content/70 group-hover:text-base-content transition-colors">
                                    {tag.name}
                                </span>
                                <span className="text-xs text-base-content/30">
                                    {tag.count || 0}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <Hash className="w-12 h-12 mx-auto text-base-content/10 mb-4" strokeWidth={1} />
                        <h3 className="text-lg font-medium text-base-content/60 mb-2">
                            {searchQuery ? 'No tags found' : 'No tags yet'}
                        </h3>
                        <p className="text-sm text-base-content/30">
                            {searchQuery
                                ? 'Try a different search term'
                                : 'Tags will appear as echos are created'
                            }
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BrowseTagsPage;