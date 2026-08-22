import { useState, useEffect } from 'react';
import { useScrollStore } from '../../../store/useScrollStore';
import useCommunityStore from '../../../store/useCommunityStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useSearchStore } from '../../../store/useSearchStore';
import useAuthStore from '../../../store/useAuthStore';

/**
 * Following a Scroll, printed as the word for what will happen.
 *
 * Held is `Following` on solid ink; pointing at it prints `Unfollow` in alarm, so
 * the destructive reading of the same button is named before it is pressed. The
 * old spinner was a rotating ring — there is nothing in this world that rotates,
 * and the state flips optimistically anyway, so the control simply stops
 * soliciting while the request is out.
 */
const SIZES = {
    xs: 'h-9 px-3',
    sm: 'h-9 px-4',
    md: 'h-10 px-5',
};

const FollowButton = ({ scroll, size = 'sm', className = '' }) => {
    const { followScroll, unfollowScroll } = useScrollStore();
    const { updateScrollSavedBy: updateCommunityScrollSavedBy } = useCommunityStore();
    const { updateScrollSavedBy: updateProfileScrollSavedBy } = useProfileStore();
    const { updateScrollSavedBy: updateSearchScrollSavedBy } = useSearchStore();
    const { authUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [localIsFollowing, setLocalIsFollowing] = useState(scroll.savedBy?.includes(authUser?._id));

    useEffect(() => {
        setLocalIsFollowing(scroll.savedBy?.includes(authUser?._id));
    }, [scroll.savedBy, authUser?._id]);

    if (!authUser || scroll.creator?._id === authUser._id) return null;

    const handleFollow = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsLoading(true);

        const wasFollowing = localIsFollowing;
        const newFollowState = !wasFollowing;
        setLocalIsFollowing(newFollowState);
        updateCommunityScrollSavedBy(scroll._id, authUser._id, newFollowState);
        updateProfileScrollSavedBy(scroll._id, authUser._id, newFollowState);
        updateSearchScrollSavedBy(scroll._id, authUser._id, newFollowState);

        try {
            if (wasFollowing) {
                await unfollowScroll(scroll._id);
            } else {
                await followScroll(scroll._id);
            }
        } catch (error) {
            setLocalIsFollowing(wasFollowing);
            updateCommunityScrollSavedBy(scroll._id, authUser._id, wasFollowing);
            updateProfileScrollSavedBy(scroll._id, authUser._id, wasFollowing);
            updateSearchScrollSavedBy(scroll._id, authUser._id, wasFollowing);
            console.log('Error toggling follow:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const held = localIsFollowing;

    return (
        <button
            type="button"
            onClick={handleFollow}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoading}
            aria-pressed={held}
            className={`act ${SIZES[size] ?? SIZES.sm} ${
                held ? (isHovered ? 'act-alarm' : '') : 'act-outline'
            } ${className}`}
        >
            {held ? (isHovered ? 'Unfollow' : 'Following') : 'Follow'}
        </button>
    );
};

export default FollowButton;
