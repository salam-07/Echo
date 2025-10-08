// GET /echo/:id - get a single echo by ID
import Echo from "../models/echo.model.js";
import Tag from "../models/tag.model.js";

// POST /echo - create a new echo
export const postEcho = async (req, res) => {
    try {
        const { content, tags } = req.body;
        const userId = req.user._id;

        if (!content || typeof content !== "string" || !content.trim()) {
            return res.status(400).json({ error: "Content is required." });
        }

        // tags can be array of strings (tag names) or ObjectIds
        let tagIds = [];
        if (Array.isArray(tags)) {
            for (let tag of tags) {
                if (!tag) continue;
                // If tag is an ObjectId, use as is
                if (typeof tag === 'string' && tag.match(/^[0-9a-fA-F]{24}$/)) {
                    tagIds.push(tag);
                } else if (typeof tag === 'string') {
                    // Try to find tag by name
                    let tagDoc = await Tag.findOne({ name: tag });
                    if (!tagDoc) {
                        tagDoc = await Tag.create({ name: tag });
                    }
                    tagIds.push(tagDoc._id);
                }
            }
        }

        const echo = await Echo.create({
            author: userId,
            content: content.trim(),
            tags: tagIds,
        });

        res.status(201).json({ echo });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to post echo." });
    };
};


// DELETE /echo/:id - delete an echo (only by author)
export const deleteEcho = async (req, res) => {
    try {
        const echoId = req.params.id;
        const userId = req.user._id;
        const echo = await Echo.findById(echoId);
        if (!echo) {
            return res.status(404).json({ error: "Echo not found." });
        }
        if (echo.author.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Not authorized to delete this echo." });
        }
        await Echo.findByIdAndDelete(echoId);
        res.status(200).json({ message: "Echo deleted." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete echo." });
    }
};


// GET /echo - get all echos (optionally filter by tag or user)
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

        // Add isLiked field for current user
        const echosWithLikeStatus = echos.map(echo => ({
            ...echo.toObject(),
            isLiked: echo.likedBy.includes(userId)
        }));

        res.status(200).json({ echos: echosWithLikeStatus });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch echos." });
    }
};

export const viewEcho = async (req, res) => {
    try {
        const echoId = req.params.id;
        const userId = req.user._id;
        const echo = await Echo.findById(echoId)
            .populate('author', 'userName')
            .populate('tags', 'name');
        if (!echo) {
            return res.status(404).json({ error: "Echo not found." });
        }

        // Add isLiked field for current user
        const echoWithLikeStatus = {
            ...echo.toObject(),
            isLiked: echo.likedBy.includes(userId)
        };

        res.status(200).json({ echo: echoWithLikeStatus });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch echo." });
    }
};

// POST /echo/like/:id - like an echo
export const likeEcho = async (req, res) => {
    try {
        const echoId = req.params.id;
        const userId = req.user._id;

        const echo = await Echo.findById(echoId);
        if (!echo) {
            return res.status(404).json({ error: "Echo not found." });
        }

        // Check if user already liked this echo
        if (echo.likedBy.includes(userId)) {
            return res.status(400).json({ error: "Echo already liked." });
        }

        // Add user to likedBy array and increment likes count
        echo.likedBy.push(userId);
        echo.likes = echo.likedBy.length;
        await echo.save();

        res.status(200).json({
            message: "Echo liked successfully.",
            likes: echo.likes,
            isLiked: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to like echo." });
    }
};

// DELETE /echo/like/:id - unlike an echo
export const unlikeEcho = async (req, res) => {
    try {
        const echoId = req.params.id;
        const userId = req.user._id;

        const echo = await Echo.findById(echoId);
        if (!echo) {
            return res.status(404).json({ error: "Echo not found." });
        }

        // Check if user has liked this echo
        if (!echo.likedBy.includes(userId)) {
            return res.status(400).json({ error: "Echo not liked yet." });
        }

        // Remove user from likedBy array and update likes count
        echo.likedBy = echo.likedBy.filter(id => id.toString() !== userId.toString());
        echo.likes = echo.likedBy.length;
        await echo.save();

        res.status(200).json({
            message: "Echo unliked successfully.",
            likes: echo.likes,
            isLiked: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to unlike echo." });
    }
};