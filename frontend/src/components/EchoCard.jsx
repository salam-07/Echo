import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share, MoreHorizontal } from 'lucide-react';
import { useEchoStore } from '../store/useEchoStore';
import useAuthStore from '../store/useAuthStore';
import AddToScrollModal from './AddToScrollModal';
import EchoMenu from './EchoMenu';

const EchoCard = ({ echo }) => {
    const { toggleLike, deleteEcho } = useEchoStore();
    const { authUser } = useAuthStore();
    const isLiked = echo.isLiked;
    const [showMenu, setShowMenu] = useState(false);
    const [showAddToScroll, setShowAddToScroll] = useState(false);
    const isOwnEcho = authUser?._id === echo.author?._id;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'now';
        if (diffInHours < 24) return `${diffInHours}h`;
        if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(echo._id);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this echo?')) {
            try {
                await deleteEcho(echo._id);
                setShowMenu(false);
            } catch (error) {
                console.log('Error deleting echo:', error);
            }
        }
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/echo/${echo._id}`;
        navigator.clipboard.writeText(link);
        setShowMenu(false);
    };

    return (
        <article className="group">
            <div className="bg-base-100 border-b border-base-300/30 transition-all duration-200">
                <div className="p-5">
                    {/* Header: Username, Date, and Actions */}
                    <header className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Link
                                to={`/user/${echo.author?._id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm font-medium text-base-content hover:text-base-content/70 transition-colors"
                            >
                                @{echo.author?.userName || 'Anonymous'}
                            </Link>
                            <span className="text-xs text-base-content/50">
                                ·
                            </span>
                            <time className="text-xs text-base-content/50">
                                {formatDate(echo.createdAt)}
                            </time>
                        </div>

                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className=" p-1.5 rounded-full hover:bg-base-300/50 transition-all duration-200"
                                aria-label="More options"
                            >
                                <MoreHorizontal className="w-4 h-4 text-base-content/40" />
                            </button>
                            <EchoMenu
                                showMenu={showMenu}
                                setShowMenu={setShowMenu}
                                setShowAddToScroll={setShowAddToScroll}
                                handleDelete={handleDelete}
                                handleCopyLink={handleCopyLink}
                                isOwnEcho={isOwnEcho}
                            />
                        </div>
                    </header>

                    {/* Main Content */}
                    <Link to={`/echo/${echo._id}`} className="block mb-4">
                        <p className="text-base-content text-[15px] leading-relaxed whitespace-pre-wrap">
                            {echo.content}
                        </p>
                    </Link>

                    {/* Tags */}
                    {echo.tags && echo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {echo.tags.map((tag) => (
                                <Link
                                    key={tag._id}
                                    to={`/tag/${tag.name}`}
                                    className="inline-flex items-center px-2 py-0.5 text-xs text-base-content/60 bg-base-200/50 rounded-full hover:bg-base-200/80 hover:text-primary transition-colors"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <footer className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-6">
                            <button
                                className={`flex items-center gap-1.5 transition-all ${isLiked ? 'text-red-500' : 'text-base-content/50 hover:text-red-500'
                                    }`}
                                onClick={handleLike}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                <span className="text-xs font-medium">
                                    {echo.likes > 0 ? echo.likes : 'Like'}
                                </span>
                            </button>

                            <button
                                className="group/share flex items-center gap-1.5 text-base-content/50 hover:text-base-content/70 transition-all duration-200"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Handle share action
                                    if (navigator.share) {
                                        navigator.share({
                                            title: `Echo by @${echo.author?.userName}`,
                                            text: echo.content,
                                            url: `${window.location.origin}/echo/${echo._id}`
                                        });
                                    } else {
                                        navigator.clipboard.writeText(`${window.location.origin}/echo/${echo._id}`);
                                    }
                                }}
                            >
                                <div className="p-1.5 rounded-full  group-hover/share:text-blue-500 transition-all duration-200">
                                    <Share className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-medium">Share</span>
                            </button>
                        </div>

                        {/* Echo ID or metadata could go here */}
                        <div className="">
                            <span className="text-xs text-base-content/30">
                                #{echo._id?.slice(-6)}
                            </span>
                        </div>
                    </footer>
                </div>
            </div>

            {/* Add to Scroll Modal */}
            {showAddToScroll && (
                <AddToScrollModal
                    echoId={echo._id}
                    onClose={() => setShowAddToScroll(false)}
                />
            )}
        </article>
    );
};

export default EchoCard;