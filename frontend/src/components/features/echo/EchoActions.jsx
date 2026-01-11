import React, { memo } from 'react';
import { Heart, Share2, Bookmark, MessageCircle } from 'lucide-react';

const ActionButton = memo(({ onClick, children, count, isActive, label }) => (
    <button
        onClick={onClick}
        className={`
            group/btn flex items-center gap-1.5 py-1.5 px-2 -ml-2 rounded-full
            transition-all duration-200
            ${isActive
                ? 'text-base-content/60'
                : 'text-base-content/30 hover:text-base-content/50 hover:bg-base-content/[0.04]'
            }
        `}
        aria-label={label}
    >
        {children}
        {typeof count === 'number' && count > 0 && (
            <span className="text-xs tabular-nums font-medium">{count}</span>
        )}
    </button>
));

ActionButton.displayName = 'ActionButton';

const EchoActions = memo(({ echo, isLiked, onLike, onBookmark }) => {
    const replyCount = echo.replies?.length || 0;
    const likeCount = echo.likes || 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                {/* Like */}
                <ActionButton onClick={onLike} count={likeCount} isActive={isLiked} label="Like">
                    <Heart
                        className={`w-[18px] h-[18px] transition-transform duration-200 ${isLiked ? 'fill-current scale-110' : 'group-hover/btn:scale-110'}`}
                        strokeWidth={isLiked ? 0 : 1.5}
                    />
                </ActionButton>

                {/* Reply */}
                <ActionButton count={replyCount} label="Reply">
                    <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </ActionButton>
            </div>

            <div className="flex items-center gap-1">
                {/* Bookmark */}
                <ActionButton onClick={onBookmark} label="Save to scroll">
                    <Bookmark className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </ActionButton>

                {/* Share */}
                <ActionButton label="Share">
                    <Share2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </ActionButton>
            </div>
        </div>
    );
});

EchoActions.displayName = 'EchoActions';

export default EchoActions;