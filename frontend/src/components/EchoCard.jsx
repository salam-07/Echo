import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share } from 'lucide-react';

const EchoCard = ({ echo }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Link
            to={`/echo/${echo._id}`}
            className="block group"
        >
            <div className="bg-base-100 border-b border-base-300 hover:bg-base-200/50 transition-all duration-200 lg:hover:scale-[1.01]">
                <div className="p-4">
                    {/* Header: Username and Date */}
                    <div className="flex justify-between items-center mb-3">
                        <Link to={`/user/${echo.author._id}`}>
                            <span className="text-sm font-medium text-base-content underline underline-offset-2">
                                @{echo.author?.userName || 'Anonymous'}
                            </span></Link>
                        <span className="text-xs text-base-content/50">
                            {formatDate(echo.createdAt)}
                        </span>
                    </div>

                    {/* Main Content */}
                    <div className="mb-3">
                        <p className="text-base-content text-sm leading-relaxed">
                            {echo.content}
                        </p>
                    </div>

                    {/* Tags (if any) */}
                    {echo.tags && echo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {echo.tags.map((tag) => (
                                <span
                                    key={tag._id}
                                    className="text-xs text-base-content/60"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions: Like and Share */}
                    <div className="flex items-center gap-6">
                        <button
                            className="flex items-center gap-1 text-base-content/40 hover:text-base-content/70 lg:hover:scale-105 transition-all duration-200"
                            onClick={(e) => {
                                e.preventDefault();
                                // Handle like action
                            }}
                        >
                            <Heart className="w-4 h-4" />
                            <span className="text-xs">Like</span>
                        </button>

                        <button
                            className="flex items-center gap-1 text-base-content/40 hover:text-base-content/70 lg:hover:scale-105 transition-all duration-200"
                            onClick={(e) => {
                                e.preventDefault();
                                // Handle share action
                            }}
                        >
                            <Share className="w-4 h-4" />
                            <span className="text-xs">Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EchoCard;