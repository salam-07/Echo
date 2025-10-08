import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share, Calendar } from 'lucide-react';
import { useEchoStore } from '../store/useEchoStore';
import Layout from '../layouts/Layout';

const EchoView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getEcho, echo, isLoadingEcho, toggleLike } = useEchoStore();
    const isLiked = echo?.isLiked;

    useEffect(() => {
        if (id) {
            getEcho(id);
        }
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleLike = () => toggleLike(echo._id);

    if (isLoadingEcho) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto p-6">
                    <div className="bg-base-100 rounded-box p-6 border border-base-300">
                        <div className="animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-6 h-6 bg-base-300 rounded"></div>
                                <div className="h-4 bg-base-300 rounded w-24"></div>
                            </div>
                            <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-base-300 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!echo) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto p-6">
                    <div className="text-center py-8">
                        <h2 className="text-xl font-semibold text-base-content mb-2">Echo not found</h2>
                        <p className="text-base-content/60 mb-4">This echo may have been deleted or doesn't exist.</p>
                        <button
                            onClick={handleBack}
                            className="btn btn-outline"
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-6">
                {/* Header with Back Arrow and Username */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-full hover:bg-base-200 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-base-content" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-base-content">
                            Echo by{' '}
                            <Link
                                to={`/user/${echo.author?._id}`}
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                @{echo.author?.userName || 'Anonymous'}
                            </Link>
                        </h1>
                    </div>
                </div>

                {/* Echo Content - Similar to EchoCard */}
                <div className="bg-base-100 border border-base-300 rounded-lg">
                    <div className="p-6">
                        {/* Header: Username and Date */}
                        <div className="flex justify-between items-center mb-4">
                            <Link
                                to={`/user/${echo.author?._id}`}
                                className="text-sm font-medium text-base-content hover:text-primary transition-colors"
                            >
                                @{echo.author?.userName || 'Anonymous'}
                            </Link>
                            <span className="text-xs text-base-content/50 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(echo.createdAt)}
                            </span>
                        </div>

                        {/* Main Content */}
                        <div className="mb-4">
                            <p className="text-base-content text-base leading-relaxed">
                                {echo.content}
                            </p>
                        </div>

                        {/* Tags (if any) */}
                        {echo.tags && echo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {echo.tags.map((tag) => (
                                    <span
                                        key={tag._id}
                                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Actions: Like and Share */}
                        <div className="flex items-center gap-6 pt-4 border-t border-base-300">
                            <button
                                className={`flex items-center gap-2 transition-all ${isLiked ? 'text-red-500' : 'text-base-content/60 hover:text-red-500'
                                    }`}
                                onClick={handleLike}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                <span className="text-sm">Like</span>
                                {echo.likes > 0 && (
                                    <span className="text-xs text-base-content/50">({echo.likes})</span>
                                )}
                            </button>

                            <button
                                className="flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors"
                                onClick={() => {
                                    // Handle share action
                                    if (navigator.share) {
                                        navigator.share({
                                            title: `Echo by @${echo.author?.userName}`,
                                            text: echo.content,
                                            url: window.location.href
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        // You could show a toast here
                                    }
                                }}
                            >
                                <Share className="w-5 h-5" />
                                <span className="text-sm">Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EchoView;