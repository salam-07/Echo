import User from "../models/user.model.js";
import Echo from "../models/echo.model.js";
import Scroll from "../models/scroll.model.js";

// GET /search/users - search for users by username
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 1) {
            return res.status(200).json({ users: [] });
        }

        // Search for users whose username contains the query string (case-insensitive)
        const users = await User.find({
            userName: { $regex: q, $options: 'i' }
        })
            .select('_id userName')
            .limit(10)
            .sort({ userName: 1 });

        res.status(200).json({ users });
    } catch (error) {
        console.log("Error in searchUsers controller", error);
        res.status(500).json({ error: "Failed to search users" });
    }
};

// GET /search - unified search across echos, scrolls, curations, and users
export const searchAll = async (req, res) => {
    try {
        const { q, limit = 5 } = req.query;
        const userId = req.user._id;

        if (!q || q.trim().length < 1) {
            return res.status(200).json({
                echos: [],
                feeds: [],
                curations: [],
                users: []
            });
        }

        // Escape special regex characters
        const searchQuery = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const limitNum = parseInt(limit);

        // Search echos by content
        const echos = await Echo.find({
            content: { $regex: searchQuery, $options: 'i' }
        })
            .populate('author', 'userName')
            .populate('tags', 'name')
            .sort({ createdAt: -1 })
            .limit(limitNum);

        const echosWithLikes = echos.map(echo => ({
            ...echo.toObject(),
            isLiked: echo.likedBy.includes(userId)
        }));

        // Search feeds (scrolls with type 'feed')
        const feeds = await Scroll.find({
            type: 'feed',
            $and: [
                {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { description: { $regex: searchQuery, $options: 'i' } }
                    ]
                },
                {
                    $or: [
                        { isPrivate: false },
                        { creator: userId }
                    ]
                }
            ]
        })
            .populate('creator', 'userName')
            .sort({ createdAt: -1 })
            .limit(limitNum);

        // Search curations (scrolls with type 'curation')
        const curations = await Scroll.find({
            type: 'curation',
            $and: [
                {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { description: { $regex: searchQuery, $options: 'i' } }
                    ]
                },
                {
                    $or: [
                        { isPrivate: false },
                        { creator: userId }
                    ]
                }
            ]
        })
            .populate('creator', 'userName')
            .sort({ createdAt: -1 })
            .limit(limitNum);

        // Search users by username
        const users = await User.find({
            userName: { $regex: searchQuery, $options: 'i' }
        })
            .select('_id userName')
            .limit(limitNum)
            .sort({ userName: 1 });

        res.status(200).json({
            echos: echosWithLikes,
            feeds,
            curations,
            users
        });
    } catch (error) {
        console.log("Error in searchAll controller", error);
        res.status(500).json({ error: "Failed to search" });
    }
};

// GET /search/echos - search echos with pagination
export const searchEchos = async (req, res) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;
        const userId = req.user._id;

        if (!q || q.trim().length < 1) {
            return res.status(200).json({ echos: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = { content: { $regex: q.trim(), $options: 'i' } };

        const total = await Echo.countDocuments(filter);
        const echos = await Echo.find(filter)
            .populate('author', 'userName')
            .populate('tags', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const echosWithLikes = echos.map(echo => ({
            ...echo.toObject(),
            isLiked: echo.likedBy.includes(userId)
        }));

        res.status(200).json({
            echos: echosWithLikes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.log("Error in searchEchos controller", error);
        res.status(500).json({ error: "Failed to search echos" });
    }
};

// GET /search/scrolls - search scrolls (feeds and curations) with pagination
export const searchScrolls = async (req, res) => {
    try {
        const { q, type, page = 1, limit = 20 } = req.query;
        const userId = req.user._id;

        if (!q || q.trim().length < 1) {
            return res.status(200).json({ scrolls: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } });
        }

        // Escape special regex characters
        const searchQuery = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = {
            $and: [
                {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { description: { $regex: searchQuery, $options: 'i' } }
                    ]
                },
                {
                    $or: [
                        { isPrivate: false },
                        { creator: userId }
                    ]
                }
            ]
        };

        if (type && (type === 'feed' || type === 'curation')) {
            filter.type = type;
        }

        const total = await Scroll.countDocuments(filter);
        const scrolls = await Scroll.find(filter)
            .populate('creator', 'userName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            scrolls,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.log("Error in searchScrolls controller", error);
        res.status(500).json({ error: "Failed to search scrolls" });
    }
};
