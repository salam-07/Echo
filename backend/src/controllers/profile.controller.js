import User from "../models/user.model.js";
import Echo from "../models/echo.model.js";
import Scroll from "../models/scroll.model.js";

// GET /profile/user/:id - get user profile
export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password")
            .populate("followers", "userName")
            .populate("following", "userName")
            .populate("createdScrolls", "name description createdAt")
            .populate("savedScrolls", "name description creator createdAt");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getProfile controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /profile/me - get my profile
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password")
            .populate("followers", "userName")
            .populate("following", "userName")
            .populate("createdScrolls", "name description createdAt")
            .populate("savedScrolls", "name description creator createdAt");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMyProfile controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /profile/user/:id/followers - get followers
export const getFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const followers = await User.findById(id)
            .populate({
                path: "followers",
                select: "userName bio createdAt",
                options: {
                    skip: (page - 1) * limit,
                    limit: parseInt(limit)
                }
            });

        const totalFollowers = user.followers.length;
        const totalPages = Math.ceil(totalFollowers / limit);

        res.status(200).json({
            followers: followers.followers,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalFollowers,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.log("Error in getFollowers controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /profile/user/:id/following - get following
export const getFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const following = await User.findById(id)
            .populate({
                path: "following",
                select: "userName bio createdAt",
                options: {
                    skip: (page - 1) * limit,
                    limit: parseInt(limit)
                }
            });

        const totalFollowing = user.following.length;
        const totalPages = Math.ceil(totalFollowing / limit);

        res.status(200).json({
            following: following.following,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalFollowing,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.log("Error in getFollowing controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /profile/user/:id/echos - get user echos
export const getEchos = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user._id;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const echos = await Echo.find({ author: id })
            .populate("author", "userName")
            .populate("tags", "name")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // add like status
        const echosWithLikes = echos.map(echo => ({
            ...echo.toObject(),
            isLiked: echo.likedBy.includes(userId)
        }));

        const totalEchos = await Echo.countDocuments({ author: id });
        const totalPages = Math.ceil(totalEchos / limit);

        res.status(200).json({
            echos: echosWithLikes,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalEchos,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.log("Error in getEchos controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /profile/user/:id/scrolls - get user scrolls
export const getScrolls = async (req, res) => {
    try {
        const { id } = req.params;
        const { type = "created", page = 1, limit = 10 } = req.query;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let scrolls;
        let totalScrolls;

        if (type === "created") {
            scrolls = await Scroll.find({ creator: id })
                .populate("creator", "userName")
                .populate("savedBy", "userName")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            totalScrolls = await Scroll.countDocuments({ creator: id });
        } else if (type === "saved") {
            scrolls = await Scroll.find({ savedBy: id })
                .populate("creator", "userName")
                .populate("savedBy", "userName")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            totalScrolls = await Scroll.countDocuments({ savedBy: id });
        } else {
            return res.status(400).json({ error: "Use 'created' or 'saved'" });
        }

        const totalPages = Math.ceil(totalScrolls / limit);

        res.status(200).json({
            scrolls,
            type,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalScrolls,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.log("Error in getScrolls controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
