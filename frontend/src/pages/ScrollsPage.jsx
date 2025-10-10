import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useScrollStore } from '../store/useScrollStore';
import { Scroll, List, Plus, Trash2, Lock } from 'lucide-react';

const ScrollsPage = () => {
    const { scrolls, isLoadingScrolls, getScrolls, deleteScroll, isDeletingScroll } = useScrollStore();

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    const curationScrolls = scrolls.filter(scroll => scroll.type === 'curation');
    const feedScrolls = scrolls.filter(scroll => scroll.type === 'feed');

    const handleDelete = async (scrollId, scrollName) => {
        if (window.confirm(`Are you sure you want to delete "${scrollName}"?`)) {
            try {
                await deleteScroll(scrollId);
            } catch (error) {
                console.log('Error deleting scroll:', error);
            }
        }
    };

    const ScrollCard = ({ scroll }) => (
        <div className="bg-base-100 border border-base-300 rounded-lg p-4 hover:border-base-400 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <Link
                        to={`/scroll/${scroll._id}`}
                        className="block hover:text-primary transition-colors"
                    >
                        <h3 className="font-semibold text-base-content truncate flex items-center gap-2">
                            {scroll.isPrivate && <Lock className="w-4 h-4 text-base-content/60" />}
                            {scroll.name}
                        </h3>
                        {scroll.description && (
                            <p className="text-sm text-base-content/60 mt-1 line-clamp-2">
                                {scroll.description}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${scroll.type === 'feed'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-secondary/10 text-secondary'
                                }`}>
                                {scroll.type === 'feed' ? 'Feed' : 'Curation'}
                            </span>
                            {scroll.type === 'curation' && scroll.echos && (
                                <span className="text-xs text-base-content/50">
                                    {scroll.echos.length} {scroll.echos.length === 1 ? 'echo' : 'echos'}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>
                <button
                    onClick={() => handleDelete(scroll._id, scroll.name)}
                    disabled={isDeletingScroll}
                    className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete scroll"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-base-content">My Scrolls</h1>
                        <p className="text-sm text-base-content/60 mt-1">
                            Manage your curations and feeds
                        </p>
                    </div>
                    <Link
                        to="/scroll/new"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">New Scroll</span>
                    </Link>
                </div>

                {/* Loading State */}
                {isLoadingScrolls && (
                    <div className="text-center py-12">
                        <p className="text-base-content/60">Loading scrolls...</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoadingScrolls && scrolls.length === 0 && (
                    <div className="text-center py-16">
                        <Scroll className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                        <h3 className="text-lg font-semibold text-base-content mb-2">
                            No scrolls yet
                        </h3>
                        <p className="text-sm text-base-content/60 mb-6">
                            Create your first scroll to organize echos
                        </p>
                        <Link
                            to="/scroll/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="font-medium">Create Scroll</span>
                        </Link>
                    </div>
                )}

                {/* Scrolls List */}
                {!isLoadingScrolls && scrolls.length > 0 && (
                    <div className="space-y-8">
                        {/* Feed Scrolls */}
                        {feedScrolls.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <List className="w-5 h-5 text-base-content/70" />
                                    <h2 className="text-lg font-semibold text-base-content">
                                        Feeds
                                    </h2>
                                    <span className="text-sm text-base-content/50">
                                        ({feedScrolls.length})
                                    </span>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {feedScrolls.map(scroll => (
                                        <ScrollCard key={scroll._id} scroll={scroll} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Curation Scrolls */}
                        {curationScrolls.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Scroll className="w-5 h-5 text-base-content/70" />
                                    <h2 className="text-lg font-semibold text-base-content">
                                        Curations
                                    </h2>
                                    <span className="text-sm text-base-content/50">
                                        ({curationScrolls.length})
                                    </span>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {curationScrolls.map(scroll => (
                                        <ScrollCard key={scroll._id} scroll={scroll} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ScrollsPage;
