import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useScrollStore } from '../store/useScrollStore';
import { Bookmark, Plus, Trash2, Settings, FileText, Lock } from 'lucide-react';

const CurationScrollsPage = () => {
    const { scrolls, isLoadingScrolls, getScrolls, deleteScroll, isDeletingScroll } = useScrollStore();

    useEffect(() => {
        getScrolls();
    }, [getScrolls]);

    const curationScrolls = scrolls.filter(scroll => scroll.type === 'curation');

    const handleDelete = async (scrollId, scrollName) => {
        if (window.confirm(`Are you sure you want to delete the curation "${scrollName}"?`)) {
            try {
                await deleteScroll(scrollId);
            } catch (error) {
                console.log('Error deleting curation scroll:', error);
            }
        }
    };

    const CurationScrollCard = ({ scroll }) => (
        <div className="bg-base-100 border border-base-300 rounded-xl p-5 hover:border-secondary/30 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <Link
                        to={`/scroll/${scroll._id}`}
                        className="block hover:text-secondary transition-colors group"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Bookmark className="w-5 h-5 text-secondary" />
                            {scroll.isPrivate && <Lock className="w-4 h-4 text-base-content/60" />}
                            <h3 className="font-semibold text-base-content group-hover:text-secondary transition-colors">
                                {scroll.name}
                            </h3>
                        </div>
                        {scroll.description && (
                            <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
                                {scroll.description}
                            </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-base-content/50">
                            <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium">
                                Curation
                            </span>
                            {scroll.echos && (
                                <div className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    <span>{scroll.echos.length} echo{scroll.echos.length !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                            <span>
                                Created {new Date(scroll.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        to={`/scroll/${scroll._id}/edit`}
                        className="p-2 rounded-lg hover:bg-base-200 transition-colors"
                        title="Edit curation"
                    >
                        <Settings className="w-4 h-4 text-base-content/60" />
                    </Link>
                    <button
                        onClick={() => handleDelete(scroll._id, scroll.name)}
                        disabled={isDeletingScroll}
                        className="p-2 rounded-lg hover:bg-error/10 hover:text-error transition-colors disabled:opacity-50"
                        title="Delete curation"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-base-content flex items-center gap-3">
                            <Bookmark className="w-7 h-7 text-secondary" />
                            Curation Scrolls
                        </h1>
                        <p className="text-base-content/60 mt-1">
                            Manage your manually curated collections of echoes
                        </p>
                    </div>
                    <Link
                        to="/scroll/new?type=curation"
                        className="btn btn-secondary gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Curation
                    </Link>
                </div>

                {/* Loading State */}
                {isLoadingScrolls && (
                    <div className="grid gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-base-100 border border-base-300 rounded-xl p-5">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="skeleton w-5 h-5 rounded"></div>
                                            <div className="skeleton h-6 w-32 rounded"></div>
                                        </div>
                                        <div className="skeleton h-4 w-full mb-2 rounded"></div>
                                        <div className="skeleton h-4 w-3/4 mb-3 rounded"></div>
                                        <div className="flex gap-3">
                                            <div className="skeleton h-6 w-20 rounded-full"></div>
                                            <div className="skeleton h-6 w-16 rounded"></div>
                                            <div className="skeleton h-6 w-24 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="skeleton w-8 h-8 rounded-lg"></div>
                                        <div className="skeleton w-8 h-8 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Curation Scrolls List */}
                {!isLoadingScrolls && (
                    <>
                        {curationScrolls.length > 0 ? (
                            <div className="grid gap-4">
                                {curationScrolls.map((scroll) => (
                                    <CurationScrollCard key={scroll._id} scroll={scroll} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Bookmark className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-base-content mb-2">
                                    No curations yet
                                </h3>
                                <p className="text-base-content/60 mb-6">
                                    Create your first curation to organize and collect your favorite echoes
                                </p>
                                <Link
                                    to="/scroll/new?type=curation"
                                    className="btn btn-secondary gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Curation
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default CurationScrollsPage;