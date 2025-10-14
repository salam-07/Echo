import React from 'react';
import { Heart, Share, MoreHorizontal, Bookmark } from 'lucide-react';
import { Card, IconButton, UserLink, Timestamp, Badge } from '../../ui';

const EchoActions = ({ echo, isLiked, onLike, onToggleMenu, onBookmark }) => {
    return (
        <div className="focus:outline-none flex items-center justify-between pt-3 border-t border-base-300/30">
            <div className="flex items-center gap-1">
                <IconButton
                    onClick={onLike}
                    variant="ghost"
                    size="sm"
                    className={isLiked ? 'text-red-500 hover:text-red-600' : 'text-base-content/40 hover:text-red-500'}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </IconButton>
                <span className="text-xs text-base-content/50">
                    {echo.likes || 0}
                </span>
            </div>

            <div className="flex items-center gap-1">
                <IconButton
                    onClick={onBookmark}
                    variant="ghost"
                    size="sm"
                    className="text-base-content/40 hover:text-blue-500"
                >
                    <Bookmark className="w-4 h-4" />
                </IconButton>

                <IconButton
                    variant="ghost"
                    size="sm"
                    className="text-base-content/40 hover:text-green-500"
                >
                    <Share className="w-4 h-4" />
                </IconButton>

                <IconButton
                    onClick={onToggleMenu}
                    variant="ghost"
                    size="sm"
                    className="text-base-content/40"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </IconButton>
            </div>
        </div>
    );
};

export default EchoActions;