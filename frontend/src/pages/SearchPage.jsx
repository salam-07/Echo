import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useSearchStore } from '../store/useSearchStore';
import { useEchoStore } from '../store/useEchoStore';
import { Search, ArrowRight, User, Layers, Filter, BookMarked, FileText, Loader2 } from 'lucide-react';
import EchoCard from '../components/features/echo/EchoCard';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [localQuery, setLocalQuery] = useState(query);

    const {
        echos,
        feeds,
        curations,
        users,
        isSearching,
        searchAll,
        clearSearch
    } = useSearchStore();

    const { likeEcho } = useEchoStore();

    useEffect(() => {
        if (query) {
            setLocalQuery(query);
            searchAll(query);
        } else {
            clearSearch();
        }
    }, [query, searchAll, clearSearch]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (localQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
        }
    };

    const hasResults = echos.length > 0 || feeds.length > 0 || curations.length > 0 || users.length > 0;

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex items-center gap-3 border-b border-base-content/10 pb-3">
                            <Search className="w-5 h-5 text-base-content/40 flex-shrink-0" />
                            <input
                                type="text"
                                value={localQuery}
                                onChange={(e) => setLocalQuery(e.target.value)}
                                placeholder="Search echos, scrolls, users..."
                                className="flex-1 bg-transparent text-lg text-base-content placeholder:text-base-content/25 outline-none"
                                autoFocus
                            />
                            {localQuery && (
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-base-content/10 hover:bg-base-content/20 text-base-content/70 text-sm rounded-full transition-colors"
                                >
                                    Search
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Loading State */}
                {isSearching && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 text-base-content/30 animate-spin" />
                    </div>
                )}

                {/* No Query State */}
                {!query && !isSearching && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200/30 mb-4">
                            <Search className="w-7 h-7 text-base-content/30" />
                        </div>
                        <p className="text-base-content/40 text-sm">
                            Start typing to search
                        </p>
                    </div>
                )}

                {/* No Results State */}
                {query && !isSearching && !hasResults && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200/30 mb-4">
                            <Search className="w-7 h-7 text-base-content/30" />
                        </div>
                        <p className="text-base-content/60 mb-2">No results found</p>
                        <p className="text-base-content/40 text-sm">
                            Try different keywords or check your spelling
                        </p>
                    </div>
                )}

                {/* Results */}
                {query && !isSearching && hasResults && (
                    <div className="space-y-10">
                        {/* Echos Section */}
                        {echos.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-base-content/40" />
                                        <h2 className="text-sm font-medium text-base-content/70">Echos</h2>
                                    </div>
                                    <Link
                                        to={`/search/echos?q=${encodeURIComponent(query)}`}
                                        className="flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content/60 transition-colors"
                                    >
                                        View all <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                                <div className="space-y-0">
                                    {echos.map((echo) => (
                                        <EchoCard
                                            key={echo._id}
                                            echo={echo}
                                            onLike={() => likeEcho(echo._id)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Users Section */}
                        {users.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-base-content/40" />
                                        <h2 className="text-sm font-medium text-base-content/70">Users</h2>
                                    </div>
                                    <Link
                                        to={`/search/users?q=${encodeURIComponent(query)}`}
                                        className="flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content/60 transition-colors"
                                    >
                                        View all <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {users.map((user) => (
                                        <Link
                                            key={user._id}
                                            to={`/user/${user._id}`}
                                            className="flex items-center gap-3 p-3 rounded-lg border border-base-content/5 hover:border-base-content/10 hover:bg-base-content/[0.02] transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-base-content/10 flex items-center justify-center text-xs font-medium text-base-content/50">
                                                {user.userName?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <span className="text-sm text-base-content/70 truncate">
                                                @{user.userName}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Feeds Section */}
                        {feeds.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-base-content/40" />
                                        <h2 className="text-sm font-medium text-base-content/70">Feeds</h2>
                                    </div>
                                    <Link
                                        to={`/search/scrolls?q=${encodeURIComponent(query)}&type=feed`}
                                        className="flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content/60 transition-colors"
                                    >
                                        View all <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                                <div className="space-y-2">
                                    {feeds.map((feed) => (
                                        <Link
                                            key={feed._id}
                                            to={`/scroll/${feed._id}`}
                                            className="block p-4 rounded-lg border border-base-content/5 hover:border-base-content/10 hover:bg-base-content/[0.02] transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-base-content/5 flex items-center justify-center flex-shrink-0">
                                                    <Filter className="w-4 h-4 text-base-content/40" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-base-content/80 truncate">
                                                        {feed.name}
                                                    </h3>
                                                    {feed.description && (
                                                        <p className="text-xs text-base-content/40 truncate mt-0.5">
                                                            {feed.description}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-base-content/30 mt-1">
                                                        by @{feed.creator?.userName}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Curations Section */}
                        {curations.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <BookMarked className="w-4 h-4 text-base-content/40" />
                                        <h2 className="text-sm font-medium text-base-content/70">Curations</h2>
                                    </div>
                                    <Link
                                        to={`/search/scrolls?q=${encodeURIComponent(query)}&type=curation`}
                                        className="flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content/60 transition-colors"
                                    >
                                        View all <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                                <div className="space-y-2">
                                    {curations.map((curation) => (
                                        <Link
                                            key={curation._id}
                                            to={`/scroll/${curation._id}`}
                                            className="block p-4 rounded-lg border border-base-content/5 hover:border-base-content/10 hover:bg-base-content/[0.02] transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-base-content/5 flex items-center justify-center flex-shrink-0">
                                                    <BookMarked className="w-4 h-4 text-base-content/40" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-base-content/80 truncate">
                                                        {curation.name}
                                                    </h3>
                                                    {curation.description && (
                                                        <p className="text-xs text-base-content/40 truncate mt-0.5">
                                                            {curation.description}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-base-content/30 mt-1">
                                                        by @{curation.creator?.userName} • {curation.echos?.length || 0} echos
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SearchPage;
