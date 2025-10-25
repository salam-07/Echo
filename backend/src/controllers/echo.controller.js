import Echo from "../models/echo.model.js";
import Tag from "../models/tag.model.js";
import { getEchoSortingOptions } from "../lib/sorting.js";

// POST /echo - create a new echo
export const postEcho = async (req, res) => {
    try {
        const { content, tags } = req.body;
        const userId = req.user._id;

        if (!content || !content.trim()) {
            return res.status(400).json({ error: "Content is required" });
        }

        // handle tags
        let tagIds = [];
        if (tags && Array.isArray(tags)) {
            for (let tagName of tags) {
                if (tagName && typeof tagName === 'string') {
                    let tag = await Tag.findOne({ name: tagName });
                    if (!tag) {
                        tag = await Tag.create({ name: tagName });
                    }
                    tagIds.push(tag._id);
                }
            }
        }

        const echo = await Echo.create({
            author: userId,
            content: content.trim(),
            tags: tagIds,
        });

        res.status(201).json({ echo });
    } catch (error) {
        console.log("Error in postEcho controller", error);
        res.status(500).json({ error: "Failed to post echo" });
    }
};

// DELETE /echo/:id - delete an echo
export const deleteEcho = async (req, res) => {
    try {
        const echoId = req.params.id;
        const userId = req.user._id;

        const echo = await Echo.findById(echoId);
        if (!echo) {
            return res.status(404).json({ error: "Echo not found" });
        }

        if (echo.author.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await Echo.findByIdAndDelete(echoId);
        res.status(200).json({ message: "Echo deleted" });
    } catch (error) {
        console.log("Error in deleteEcho controller", error);
        res.status(500).json({ error: "Failed to delete echo" });
    }
};

// GET /echo - get all echos
export const getAllEcho = async (req, res) => {
    try {
        const { tag, user, page = 1, limit = 20 } = req.query;
        const userId = req.user._id;

        const filter = {};
        if (tag) filter.tags = tag;
        if (user) filter.author = user;

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get total count for pagination metadata
        const total = await Echo.countDocuments(filter);

        const echos = await Echo.find(filter)
            .populate('author', 'userName')
            .populate('tags', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // add like status
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
                totalPages: Math.ceil(total / parseInt(limit)),
                hasMore: skip + echos.length < total
            }
        });
    } catch (error) {
        console.log("Error in getAllEcho controller", error);
        res.status(500).json({ error: "Failed to fetch echos" });
    }
};

// GET /echo/:id - get single echo
export const viewEcho = async (req, res) => {
    try {
        const echoId = req.params.id;
        const userId = req.user._id;

        const echo = await Echo.findById(echoId)
            .populate('author', 'userName')
            .populate('tags', 'name')
            .populate('replies.user', 'userName');

        if (!echo) {
            return res.status(404).json({ error: "Echo not found" });
        }

        // Sort replies by oldest first
        if (echo.replies && echo.replies.length > 0) {
            echo.replies.sort((a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
            );
        }

        const echoWithLikes = {
            ...echo.toObject(),
            isLiked: echo.likedBy.includes(userId)
        };

        res.status(200).json({ echo: echoWithLikes });
    } catch (error) {
        console.log("Error in viewEcho controller", error);
        res.status(500).json({ error: "Failed to fetch echo" });
    }
};

// POST /echo/like/:id - like an echo
export const likeEcho = async (req, res) => {
    try {
        const echoId = req.params.id;
        const userId = req.user._id;

        const echo = await Echo.findById(echoId);
        if (!echo) {
            return res.status(404).json({ error: "Echo not found" });
        }

        // Check if already liked
        if (echo.likedBy.includes(userId)) {
            // Already liked - return current state instead of error
            return res.status(200).json({
                message: "Echo already liked",
                likes: echo.likes,
                isLiked: true
            });
        }

        echo.likedBy.push(userId);
        echo.likes = echo.likedBy.length;
        await echo.save();

        res.status(200).json({
            message: "Echo liked",
            likes: echo.likes,
            isLiked: true
        });
    } catch (error) {
        console.log("Error in likeEcho controller", error);
        res.status(500).json({ error: "Failed to like echo" });
    }
};

// DELETE /echo/like/:id - unlike an echo
export const unlikeEcho = async (req, res) => {
    try {
        const echoId = req.params.id;
        const userId = req.user._id;

        const echo = await Echo.findById(echoId);
        if (!echo) {
            return res.status(404).json({ error: "Echo not found" });
        }

        // Check if not liked yet
        if (!echo.likedBy.includes(userId)) {
            // Not liked yet - return current state instead of error
            return res.status(200).json({
                message: "Echo not liked yet",
                likes: echo.likes,
                isLiked: false
            });
        }

        echo.likedBy = echo.likedBy.filter(id => id.toString() !== userId.toString());
        echo.likes = echo.likedBy.length;
        await echo.save();

        res.status(200).json({
            message: "Echo unliked",
            likes: echo.likes,
            isLiked: false
        });
    } catch (error) {
        console.log("Error in unlikeEcho controller", error);
        res.status(500).json({ error: "Failed to unlike echo" });
    }
};

// GET /echo/tag/:tagName - get echos by tag
export const getEchosByTag = async (req, res) => {
    try {
        const { tagName } = req.params;
        const { orderBy, timeframe, startDate, endDate } = req.query;
        const userId = req.user._id;

        const tag = await Tag.findOne({ name: tagName });
        if (!tag) {
            return res.status(404).json({ error: "Tag not found" });
        }

        const baseQuery = { tags: tag._id };
        const { query, sort } = getEchoSortingOptions(baseQuery, orderBy, timeframe, startDate, endDate);

        const echos = await Echo.find(query)
            .populate('author', 'userName')
            .populate('tags', 'name')
            .sort(sort);

        // add like status
        const echosWithLikes = echos.map(echo => ({
            ...echo.toObject(),
            isLiked: echo.likedBy.includes(userId)
        }));

        res.status(200).json({ echos: echosWithLikes, tag: tagName });
    } catch (error) {
        console.log("Error in getEchosByTag controller", error);
        res.status(500).json({ error: "Failed to fetch echos" });
    }
};

// POST /echo/:id/reply - add a reply to an echo
export const addReply = async (req, res) => {
    try {
        const echoId = req.params.id;
        const { comment } = req.body;
        const userId = req.user._id;

        if (!comment || !comment.trim()) {
            return res.status(400).json({ error: "Comment is required" });
        }

        if (comment.trim().length > 500) {
            return res.status(400).json({ error: "Comment must be 500 characters or less" });
        }

        const echo = await Echo.findById(echoId);
        if (!echo) {
            return res.status(404).json({ error: "Echo not found" });
        }

        // Add reply
        echo.replies.push({
            user: userId,
            comment: comment.trim(),
            createdAt: new Date()
        });

        await echo.save();

        // Populate the new reply with user info
        await echo.populate('replies.user', 'userName');

        // Get the newly added reply
        const newReply = echo.replies[echo.replies.length - 1];

        res.status(201).json({
            reply: newReply,
            replyCount: echo.replies.length
        });
    } catch (error) {
        console.log("Error in addReply controller", error);
        res.status(500).json({ error: "Failed to add reply" });
    }
};

// DELETE /echo/:id/reply/:replyId - delete a reply
export const deleteReply = async (req, res) => {
    try {
        const { id: echoId, replyId } = req.params;
        const userId = req.user._id;

        const echo = await Echo.findById(echoId);
        if (!echo) {
            return res.status(404).json({ error: "Echo not found" });
        }

        const reply = echo.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({ error: "Reply not found" });
        }

        // Only the reply author can delete their reply
        if (reply.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Not authorized" });
        }

        echo.replies.pull(replyId);
        await echo.save();

        res.status(200).json({
            message: "Reply deleted",
            replyCount: echo.replies.length
        });
    } catch (error) {
        console.log("Error in deleteReply controller", error);
        res.status(500).json({ error: "Failed to delete reply" });
    }
};

// GET /echo/:id/replies - get all replies for an echo
export const getReplies = async (req, res) => {
    try {
        const echoId = req.params.id;

        const echo = await Echo.findById(echoId)
            .populate('replies.user', 'userName')
            .select('replies');

        if (!echo) {
            return res.status(404).json({ error: "Echo not found" });
        }

        // Sort replies by oldest first
        const sortedReplies = echo.replies.sort((a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );

        res.status(200).json({
            replies: sortedReplies,
            replyCount: echo.replies.length
        });
    } catch (error) {
        console.log("Error in getReplies controller", error);
        res.status(500).json({ error: "Failed to fetch replies" });
    }
};