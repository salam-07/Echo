import { useState, useEffect } from 'react';
import { Plus, Check, UserMinus } from 'lucide-react';
import { useScrollStore } from '../../../store/useScrollStore';
import useCommunityStore from '../../../store/useCommunityStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useSearchStore } from '../../../store/useSearchStore';
import useAuthStore from '../../../store/useAuthStore';

const FollowButton = ({ scroll, size = 'sm', className = '' }) => {
    const { followScroll, unfollowScroll } = useScrollStore();
    const { updateScrollSavedBy: updateCommunityScrollSavedBy } = useCommunityStore();
    const { updateScrollSavedBy: updateProfileScrollSavedBy } = useProfileStore();
    const { updateScrollSavedBy: updateSearchScrollSavedBy } = useSearchStore();
    const { authUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Track follow state locally for immediate UI updates
    const [localIsFollowing, setLocalIsFollowing] = useState(
        scroll.savedBy?.includes(authUser?._id)
    );

    // Sync local state when scroll prop changes (e.g., after page navigation)
    useEffect(() => {
        setLocalIsFollowing(scroll.savedBy?.includes(authUser?._id));
    }, [scroll.savedBy, authUser?._id]);

    // Don't show button for own scrolls or if not authenticated
    if (!authUser || scroll.creator?._id === authUser._id) {
        return null;
    }

    const handleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);

        // Optimistically update local state immediately
        const newFollowState = !localIsFollowing;
        setLocalIsFollowing(newFollowState);

        // Also update all stores
        updateCommunityScrollSavedBy(scroll._id, authUser._id, newFollowState);
        updateProfileScrollSavedBy(scroll._id, authUser._id, newFollowState);
        updateSearchScrollSavedBy(scroll._id, authUser._id, newFollowState);

        try {
            if (localIsFollowing) {
                await unfollowScroll(scroll._id);
            } else {
                await followScroll(scroll._id);
            }
        } catch (error) {
            // Revert local state and all stores on error
            setLocalIsFollowing(localIsFollowing);
            updateCommunityScrollSavedBy(scroll._id, authUser._id, localIsFollowing);
            updateProfileScrollSavedBy(scroll._id, authUser._id, localIsFollowing);
            updateSearchScrollSavedBy(scroll._id, authUser._id, localIsFollowing);
            console.log('Error toggling follow:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Size variants
    const sizeClasses = {
        xs: 'h-7 px-2.5 text-xs gap-1',
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-9 px-4 text-sm gap-2',
    };

    const iconSizes = {
        xs: 'w-3 h-3',
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
    };

    if (localIsFollowing) {
        return (
            <button
                onClick={handleFollow}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={isLoading}
                className={`
                    inline-flex items-center justify-center font-medium rounded-full
                    transition-all duration-200
                    ${sizeClasses[size] || sizeClasses.sm}
                    ${isHovered
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-base-content/5 text-base-content/60 border border-base-content/10'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    ${className}
                `}
            >
                {isLoading ? (
                    <span className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
                ) : isHovered ? (
                    <>
                        <UserMinus className={iconSizes[size]} />
                        {size !== 'xs' && 'Unfollow'}
                    </>
                ) : (
                    <>
                        <Check className={iconSizes[size]} />
                        {size !== 'xs' && 'Following'}
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`
                inline-flex items-center justify-center font-medium rounded-full
                transition-all duration-200
                ${sizeClasses[size] || sizeClasses.sm}
                bg-base-content text-base-100 hover:bg-base-content/90
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            {isLoading ? (
                <span className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
            ) : (
                <>
                    <Plus className={iconSizes[size]} />
                    {size !== 'xs' && 'Follow'}
                </>
            )}
        </button>
    );
};

export default FollowButton;