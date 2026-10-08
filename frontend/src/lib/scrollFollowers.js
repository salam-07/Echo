// API responses may contain follower IDs or populated user records.
const followerId = (user) => typeof user === 'string' ? user : user?._id;

export const isScrollFollowed = (savedBy = [], userId) =>
    Boolean(userId && savedBy.some((user) => followerId(user) === userId));

export const updateScrollFollowers = (savedBy = [], userId, isFollowing) => {
    if (!userId) return savedBy;
    const others = savedBy.filter((user) => followerId(user) !== userId);
    if (!isFollowing) return others;
    const existing = savedBy.find((user) => followerId(user) === userId);
    return [...others, existing ?? userId];
};
