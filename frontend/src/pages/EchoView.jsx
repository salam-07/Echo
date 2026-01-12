import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MessageCircle, Calendar } from 'lucide-react';
import { useEchoStore } from '../store/useEchoStore';
import Layout from '../layouts/Layout';
import ReplyList from '../components/features/echo/ReplyList';
import ReplyInput from '../components/features/echo/ReplyInput';
import { Timestamp } from '../components/ui';

const EchoView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getEcho, echo, isLoadingEcho, toggleLike, addReply, deleteReply } = useEchoStore();
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const isLiked = echo?.isLiked;
    const replyCount = echo?.replies?.length || 0;

    useEffect(() => {
        if (id) {
            getEcho(id);
        }
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleLike = () => {
        setIsLikeAnimating(true);
        toggleLike(echo._id);
        setTimeout(() => setIsLikeAnimating(false), 300);
    };

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
            <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
                {/* Header with Back Arrow */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-base-200/40">
                    <button
                        onClick={handleBack}
                        className="p-1.5 -ml-1.5 rounded-full text-base-content/40 hover:text-base-content/70 hover:bg-base-200/50 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-base-content/50">Echo</span>
                </div>

                {/* Echo Content */}
                <article className="py-2">
                    {/* Header: Username and Date */}
                    <div className="flex items-center gap-2 mb-3">
                        <Link
                            to={`/user/${echo.author?._id}`}
                            className="font-medium text-sm text-base-content/70 hover:text-base-content transition-colors"
                        >
                            @{echo.author?.userName || 'anonymous'}
                        </Link>
                        <span className="text-base-content/20 text-xs">·</span>
                        <Timestamp
                            date={echo.createdAt}
                            className="text-xs text-base-content/35"
                        />
                        <Calendar className="w-3 h-3" />
                    </div>

                    {/* Main Content */}
                    <div className="mb-3">
                        <p className="text-base-content text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                            {echo.content}
                        </p>
                    </div>

                    {/* Tags (if any) */}
                    {echo.tags && echo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {echo.tags.map((tag) => (
                                <Link
                                    key={tag._id}
                                    to={`/tag/${tag.name}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs text-base-content/30 hover:text-base-content/50 transition-colors"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Actions: Like and Share */}
                    <div className="flex items-center justify-between pt-3 border-t border-base-200/40">
                        <div className="flex items-center gap-1">
                            <button
                                className={`flex items-center gap-1.5 py-1.5 px-2.5 -ml-2 rounded-full transition-colors duration-150 ${isLiked
                                    ? 'text-base-content/60'
                                    : 'text-base-content/25 hover:text-base-content/45 hover:bg-base-content/[0.03]'
                                    }`}
                                onClick={handleLike}
                            >
                                <Heart
                                    className={`w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] transition-all duration-200 ${isLiked ? 'fill-current' : ''
                                        } ${isLikeAnimating ? 'scale-125' : ''}`}
                                    strokeWidth={isLiked ? 0 : 1.5}
                                />
                                {echo.likes > 0 && (
                                    <span className={`text-[11px] sm:text-xs tabular-nums font-medium transition-transform duration-200 ${isLikeAnimating ? 'scale-110' : ''}`}>
                                        {echo.likes}
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center gap-1.5 py-1.5 px-2.5 text-base-content/25">
                                <MessageCircle className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                                {replyCount > 0 && (
                                    <span className="text-[11px] sm:text-xs tabular-nums font-medium">{replyCount}</span>
                                )}
                            </div>
                        </div>

                        <button
                            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-full text-base-content/25 hover:text-base-content/45 hover:bg-base-content/[0.03] transition-colors duration-150"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: `Echo by @${echo.author?.userName}`,
                                        text: echo.content,
                                        url: window.location.href
                                    });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                }
                            }}
                        >
                            <Share className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                        </button>
                    </div>
                </article>

                {/* Reply Section */}
                <div className="mt-6 pt-4 border-t border-base-200/40">
                    <h3 className="text-xs font-medium text-base-content/40 uppercase tracking-wider mb-4">
                        Replies {replyCount > 0 && `(${replyCount})`}
                    </h3>

                    {/* Reply Input */}
                    <div className="mb-4 pb-4 border-b border-base-200/40">
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