import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share, Calendar, MessageCircle } from 'lucide-react';
import { useEchoStore } from '../store/useEchoStore';
import Layout from '../layouts/Layout';
import ReplyList from '../components/features/echo/ReplyList';
import ReplyInput from '../components/features/echo/ReplyInput';

const EchoView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getEcho, echo, isLoadingEcho, toggleLike, addReply, deleteReply } = useEchoStore();
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const isLiked = echo?.isLiked;
    const replyCount = echo?.replies?.length || 0;

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

    const handleAddReply = async (comment) => {
        setIsSubmittingReply(true);
        try {
            await addReply(id, comment);
        } catch (error) {
            console.error('Error adding reply:', error);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const handleDeleteReply = async (replyId) => {
        if (window.confirm('Are you sure you want to delete this reply?')) {
            try {
                await deleteReply(id, replyId);
            } catch (error) {
                console.error('Error deleting reply:', error);
            }
        }
    };

    if (isLoadingEcho) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto p-3 sm:p-6">
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
                <div className="max-w-2xl mx-auto p-3 sm:p-6">
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
            <div className="w-full max-w-2xl mx-auto px-3 py-6 sm:px-6">
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
                                    <Link
                                        key={tag._id}
                                        to={`/tag/${tag.name}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center px-2 py-0.5 text-xs text-base-content/60 bg-base-200/50 rounded-full hover:bg-base-200/80 hover:text-primary transition-colors"
                                    >
                                        #{tag.name}
                                    </Link>
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

                            <div className="flex items-center gap-2 text-base-content/60">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm">Replies</span>
                                {replyCount > 0 && (
                                    <span className="text-xs text-base-content/50">({replyCount})</span>
                                )}
                            </div>

                            <button
                                className="flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors ml-auto"
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

                {/* Reply Section */}
                <div className="mt-6 bg-base-100 border border-base-300 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-base-content mb-3">
                        Replies {replyCount > 0 && `(${replyCount})`}
                    </h3>

                    {/* Reply Input - Single Line */}
                    <div className="mb-4 pb-4 border-b border-base-300">
                        <ReplyInput
                            onSubmit={handleAddReply}
                            isSubmitting={isSubmittingReply}
                        />
                    </div>

                    {/* Replies List */}
                    <ReplyList
                        replies={echo.replies || []}
                        onDeleteReply={handleDeleteReply}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default EchoView;