import { useState } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { useScrollStore } from '../store/useScrollStore';
import useAuthStore from '../store/useAuthStore';

const FollowButton = ({ scroll, size = 'sm' }) => {
    const { followScroll, unfollowScroll } = useScrollStore();
    const { authUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Don't show button for own scrolls or if not authenticated
    if (!authUser || scroll.creator._id === authUser._id) {
        return null;
    }

    const isFollowing = scroll.savedBy?.includes(authUser._id);

    const handleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        try {
            if (isFollowing) {
                await unfollowScroll(scroll._id);
            } else {
                await followScroll(scroll._id);
            }
        } catch (error) {
            console.log('Error toggling follow:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`btn ${isFollowing ? 'btn-ghost' : 'btn-primary'} btn-${size} gap-1`}
        >
            {isFollowing ? (
                <>
                    <UserMinus className="w-3 h-3" />
                    {size !== 'xs' && 'Unfollow'}
                </>
            ) : (
                <>
                    <UserPlus className="w-3 h-3" />
                    {size !== 'xs' && 'Follow'}
                </>
            )}
        </button>
    );
};

export default FollowButton;