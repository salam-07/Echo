import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useSearchStore } from '../store/useSearchStore';
import { ArrowLeft, Search, Loader2, User } from 'lucide-react';

const UserSearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const {
        users,
        isSearching,
        searchUsers
    } = useSearchStore();

    useEffect(() => {
        if (query) {
            searchUsers(query);
        }
    }, [query, searchUsers]);

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        to={`/search?q=${encodeURIComponent(query)}`}
                        className="p-2 -ml-2 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-content/5 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-medium text-base-content">Users</h1>
                        <p className="text-xs text-base-content/40">
                            Search results for "{query}"
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {isSearching && users.length === 0 && (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 text-base-content/30 animate-spin" />
                    </div>
                )}

                {/* No Results */}
                {!isSearching && users.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200/30 mb-4">
                            <Search className="w-7 h-7 text-base-content/30" />
                        </div>
                        <p className="text-base-content/60 mb-2">No users found</p>
                        <p className="text-base-content/40 text-sm">
                            Try different keywords
                        </p>
                    </div>
                )}

                {/* Results */}
                {users.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {users.map((user) => (
                            <Link
                                key={user._id}
                                to={`/user/${user._id}`}
                                className="flex items-center gap-4 p-4 rounded-lg border border-base-content/5 hover:border-base-content/10 hover:bg-base-content/[0.02] transition-colors"
                            >
                                <div className="w-12 h-12 rounded-full bg-base-content/10 flex items-center justify-center text-lg font-medium text-base-content/50">
                                    {user.userName?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-base-content/80 truncate">
                                        @{user.userName}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UserSearchPage;
