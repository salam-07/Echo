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
        const { tag, user } = req.query;
        const userId = req.user._id;

        const filter = {};
        if (tag) filter.tags = tag;
        if (user) filter.author = user;

        const echos = await Echo.find(filter)
            .populate('author', 'userName')
            .populate('tags', 'name')
            .sort({ createdAt: -1 });

        // add like status
        const echosWithLikes = echos.map(echo => ({
            ...echo.toObject(),
            isLiked: echo.likedBy.includes(userId)
        }));

        res.status(200).json({ echos: echosWithLikes });
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
            .populate('tags', 'name');

        if (!echo) {
            return res.status(404).json({ error: "Echo not found" });
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

        if (echo.likedBy.includes(userId)) {
            return res.status(400).json({ error: "Already liked" });
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

        if (!echo.likedBy.includes(userId)) {
            return res.status(400).json({ error: "Not liked yet" });
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