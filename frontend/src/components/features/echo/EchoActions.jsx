import React, { memo } from 'react';
import { Heart, Share, Bookmark, MessageCircle } from 'lucide-react';

const ActionButton = memo(({ onClick, children, count, isActive, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 text-base-content/40 hover:text-base-content/70 transition-colors ${isActive ? 'text-base-content/70' : ''} ${className}`}
    >
        {children}
        {typeof count === 'number' && (
            <span className="text-xs tabular-nums">{count}</span>
        )}
    </button>
));

ActionButton.displayName = 'ActionButton';

const EchoActions = memo(({ echo, isLiked, onLike, onToggleMenu, onBookmark }) => {
    const replyCount = echo.replies?.length || 0;

    return (
        <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-5">
                {/* Like */}
                <ActionButton onClick={onLike} count={echo.likes || 0} isActive={isLiked}>
                    <Heart
                        className={`w-4 h-4 ${isLiked ? 'fill-current text-base-content/60' : ''}`}
                        strokeWidth={1.5}
                    />
                </ActionButton>

                {/* Reply */}
                <ActionButton count={replyCount}>
                    <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                </ActionButton>
            </div>

            <div className="flex items-center gap-3">
                {/* Bookmark */}
                <ActionButton onClick={onBookmark}>
                    <Bookmark className="w-4 h-4" strokeWidth={1.5} />
                </ActionButton>

                {/* Share */}
                <ActionButton>
                    <Share className="w-4 h-4" strokeWidth={1.5} />
                </ActionButton>
            </div>
        </div>
    );
});

EchoActions.displayName = 'EchoActions';

export default EchoActions;