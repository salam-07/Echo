import React, { memo } from 'react';
import { Heart, Share2, Bookmark, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActionButton = memo(({ onClick, children, count, isActive, isAnimating, label }) => (
    <button
        onClick={onClick}
        className={`
            group/btn flex items-center gap-1.5 py-1.5 px-2.5 -ml-2 rounded-full
            transition-colors duration-150
            ${isActive
                ? 'text-base-content/60'
                : 'text-base-content/25 hover:text-base-content/45 hover:bg-base-content/[0.03]'
            }
        `}
        aria-label={label}
    >
        {children}
        {typeof count === 'number' && count > 0 && (
            <span className={`text-[11px] sm:text-xs tabular-nums font-medium transition-transform duration-200 ${isAnimating ? 'scale-110' : ''}`}>
                {count}
            </span>
        )}
    </button>
));

ActionButton.displayName = 'ActionButton';

const EchoActions = memo(({ echo, isLiked, isLikeAnimating, onLike, onBookmark }) => {
    const navigate = useNavigate();
    const replyCount = echo.replies?.length || 0;
    const likeCount = echo.likes || 0;

    const handleCommentClick = () => {
        navigate(`/echo/${echo._id}`);
    };

    return (
        <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-0.5">
                {/* Like */}
                <ActionButton
                    onClick={onLike}
                    count={likeCount}
                    isActive={isLiked}
                    isAnimating={isLikeAnimating}
                    label="Like"
                >
                    <Heart
                        className={`cursor-pointer w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] transition-all duration-200 ${isLiked ? 'fill-current' : ''
                            } ${isLikeAnimating ? 'scale-125' : ''}`}
                        strokeWidth={isLiked ? 0 : 1.5}
                    />
                </ActionButton>

                {/* Reply */}
                <ActionButton onClick={handleCommentClick} count={replyCount} label="Reply">
                    <MessageCircle className="cursor-pointer w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                </ActionButton>
            </div>

            <div className="flex items-center gap-0.5">
                {/* Bookmark */}
                <ActionButton onClick={onBookmark} label="Save to scroll">
                    <Bookmark className="cursor-pointer w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                </ActionButton>

                {/* Share */}
                <ActionButton label="Share">
                    <Share2 className="cursor-pointer w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
                </ActionButton>
            </div>
        </div>
    );
});

EchoActions.displayName = 'EchoActions';

export default EchoActions;