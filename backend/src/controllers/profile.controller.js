import User from "../models/user.model.js";
import Echo from "../models/echo.model.js";
import Scroll from "../models/scroll.model.js";

// Get any user's profile by ID
export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password") // Exclude password
            .populate("followers", "userName")
            .populate("following", "userName")
            .populate("createdScrolls", "name description createdAt")
            .populate("savedScrolls", "name description creator createdAt");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getProfile controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get current user's profile
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
        console.log("Error in getMyProfile controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get user's followers
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
        console.log("Error in getFollowers controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get user's following
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
        console.log("Error in getFollowing controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get user's echos
export const getEchos = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const echos = await Echo.find({ author: id })
            .populate("author", "userName")
            .populate("tags", "name")
            .sort({ createdAt: -1 }) // Most recent first
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalEchos = await Echo.countDocuments({ author: id });
        const totalPages = Math.ceil(totalEchos / limit);

        res.status(200).json({
            echos,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalEchos,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.log("Error in getEchos controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get user's scrolls (both created and saved)
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
            // Get user's created scrolls
            scrolls = await Scroll.find({ creator: id })
                .populate("creator", "userName")
                .populate("savedBy", "userName")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            totalScrolls = await Scroll.countDocuments({ creator: id });
        } else if (type === "saved") {
            // Get user's saved scrolls
            scrolls = await Scroll.find({ savedBy: id })
                .populate("creator", "userName")
                .populate("savedBy", "userName")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            totalScrolls = await Scroll.countDocuments({ savedBy: id });
        } else {
            return res.status(400).json({ error: "Invalid scroll type. Use 'created' or 'saved'" });
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
        console.log("Error in getScrolls controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
