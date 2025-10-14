import Scroll from "../models/scroll.model.js";
import Echo from "../models/echo.model.js";
import Tag from "../models/tag.model.js";
import User from "../models/user.model.js";

// POST /scroll/create - create a new scroll (curation or feed)
export const createScroll = async (req, res) => {
    try {
        const { name, description, type, feedConfig, isPrivate } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Scroll name is required" });
        }

        if (!type || (type !== 'curation' && type !== 'feed')) {
            return res.status(400).json({ error: "Type must be 'curation' or 'feed'" });
        }

        // Prepare scroll data
        const scrollData = {
            name: name.trim(),
            description: description ? description.trim() : '',
            type: type,
            creator: userId,
            isPrivate: isPrivate || false,
        };

        // If it's a feed type, process the feed configuration
        if (type === 'feed' && feedConfig) {
            const processedConfig = {};

            // Tag match type
            if (feedConfig.tagMatchType) {
                processedConfig.tagMatchType = feedConfig.tagMatchType;
            }

            // Process included tags
            if (feedConfig.includedTags && Array.isArray(feedConfig.includedTags)) {
                const tagIds = [];
                for (let tagName of feedConfig.includedTags) {
                    let tag = await Tag.findOne({ name: tagName });
                    if (!tag) {
                        // Create tag if it doesn't exist
                        tag = await Tag.create({ name: tagName });
                    }
                    tagIds.push(tag._id);
                }
                processedConfig.includedTags = tagIds;
            }

            // Process excluded tags
            if (feedConfig.excludedTags && Array.isArray(feedConfig.excludedTags)) {
                const tagIds = [];
                for (let tagName of feedConfig.excludedTags) {
                    let tag = await Tag.findOne({ name: tagName });
                    if (!tag) {
                        // Create tag if it doesn't exist
                        tag = await Tag.create({ name: tagName });
                    }
                    tagIds.push(tag._id);
                }
                processedConfig.excludedTags = tagIds;
            }

            // Process authors
            if (feedConfig.authors && Array.isArray(feedConfig.authors)) {
                processedConfig.authors = feedConfig.authors;
            }

            // Date range
            if (feedConfig.dateRange) {
                processedConfig.dateRange = {
                    startDate: feedConfig.dateRange.startDate ? new Date(feedConfig.dateRange.startDate) : undefined,
                    endDate: feedConfig.dateRange.endDate ? new Date(feedConfig.dateRange.endDate) : undefined
                };
            }

            // Sorting options
            if (feedConfig.sortBy) {
                processedConfig.sortBy = feedConfig.sortBy;
            }

            if (feedConfig.sortTimeRange) {
                processedConfig.sortTimeRange = feedConfig.sortTimeRange;
            }

            // Exclude liked echos option
            if (feedConfig.excludeLikedEchos !== undefined) {
                processedConfig.excludeLikedEchos = feedConfig.excludeLikedEchos;
            }

            scrollData.feedConfig = processedConfig;
        }

        // Create the scroll
        const scroll = await Scroll.create(scrollData);

        // Add scroll to user's created scrolls
        await User.findByIdAndUpdate(userId, {
            $push: { createdScrolls: scroll._id }
        });

        res.status(201).json({ scroll });
    } catch (error) {
        console.log("Error in createScroll controller", error);
        res.status(500).json({ error: "Failed to create scroll" });
    }
};

// GET /scroll/all - get all scrolls created by the user
export const getScrolls = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get both created scrolls and followed scrolls
        const scrolls = await Scroll.find({
            $or: [
                { creator: userId },        // Scrolls created by user
                { savedBy: userId }         // Scrolls followed by user
            ]
        })
            .populate('creator', 'userName')
            .populate('savedBy', 'userName')
            .populate('feedConfig.includedTags', 'name')
            .populate('feedConfig.excludedTags', 'name')
            .populate('feedConfig.authors', 'userName')
            .sort({ createdAt: -1 });

        res.status(200).json({ scrolls });
    } catch (error) {
        console.log("Error in getScrolls controller", error);
        res.status(500).json({ error: "Failed to get scrolls" });
    }
};

// GET /scroll/:id - get a specific scroll by id
export const getScrollById = async (req, res) => {
    try {
        const scrollId = req.params.id;
        const userId = req.user._id;

        const scroll = await Scroll.findById(scrollId)
            .populate('creator', 'userName')
            .populate('feedConfig.includedTags', 'name')
            .populate('feedConfig.excludedTags', 'name')
            .populate('feedConfig.authors', 'userName');

        if (!scroll) {
            return res.status(404).json({ error: "Scroll not found" });
        }

        // Check if user has access to this scroll
        const isCreator = scroll.creator._id.toString() === userId.toString();
        const hasSaved = scroll.savedBy.includes(userId);
        const isPublic = !scroll.isPrivate;

        // Allow access if: user is creator OR scroll is public OR user has saved it
        if (!isCreator && !isPublic && !hasSaved) {
            return res.status(403).json({ error: "Access denied" });
        }

        res.status(200).json({ scroll });
    } catch (error) {
        console.log("Error in getScrollById controller", error);
        res.status(500).json({ error: "Failed to get scroll" });
    }
};

// DELETE /scroll/:id - delete a scroll
export const deleteScroll = async (req, res) => {
    try {
        const scrollId = req.params.id;
        const userId = req.user._id;

        const scroll = await Scroll.findById(scrollId);

        if (!scroll) {
            return res.status(404).json({ error: "Scroll not found" });
        }

        // Only creator can delete the scroll
        if (scroll.creator.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Only the creator can delete this scroll" });
        }

        await Scroll.findByIdAndDelete(scrollId);

        // Remove from user's created scrolls
        await User.findByIdAndUpdate(userId, {
            $pull: { createdScrolls: scrollId }
        });

        // Remove from all users' saved scrolls
        await User.updateMany(
            { savedScrolls: scrollId },
            { $pull: { savedScrolls: scrollId } }
        );

        res.status(200).json({ message: "Scroll deleted successfully" });
    } catch (error) {
        console.log("Error in deleteScroll controller", error);
        res.status(500).json({ error: "Failed to delete scroll" });
    }
};

// POST /scroll/:id/add-echo - add an echo to a curation scroll
export const addEchoToCuration = async (req, res) => {
    try {
        const scrollId = req.params.id;
        const { echoId } = req.body;
        const userId = req.user._id;

        if (!echoId) {
            return res.status(400).json({ error: "Echo ID is required" });
        }

        const scroll = await Scroll.findById(scrollId);

        if (!scroll) {
            return res.status(404).json({ error: "Scroll not found" });
        }

        // Only creator can modify the scroll
        if (scroll.creator.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Only the creator can modify this scroll" });
        }

        // Check if it's a curation type
        if (scroll.type !== 'curation') {
            return res.status(400).json({ error: "Can only add echos to curation scrolls" });
        }

        // Check if echo exists
        const echo = await Echo.findById(echoId);
        if (!echo) {
            return res.status(404).json({ error: "Echo not found" });
        }

        // Check if echo is already in the scroll
        if (scroll.echos.includes(echoId)) {
            return res.status(400).json({ error: "Echo already in this scroll" });
        }

        // Add echo to the scroll
        scroll.echos.push(echoId);
        await scroll.save();

        res.status(200).json({ message: "Echo added to scroll", scroll });
    } catch (error) {
        console.log("Error in addEchoToCuration controller", error);
        res.status(500).json({ error: "Failed to add echo to scroll" });
    }
};

// DELETE /scroll/:id/remove-echo/:echoId - remove an echo from a curation scroll
export const removeEchoFromCuration = async (req, res) => {
    try {
        const scrollId = req.params.id;
        const echoId = req.params.echoId;
        const userId = req.user._id;

        const scroll = await Scroll.findById(scrollId);

        if (!scroll) {
            return res.status(404).json({ error: "Scroll not found" });
        }

        // Only creator can modify the scroll
        if (scroll.creator.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Only the creator can modify this scroll" });
        }

        // Check if it's a curation type
        if (scroll.type !== 'curation') {
            return res.status(400).json({ error: "Can only remove echos from curation scrolls" });
        }

        // Remove echo from the scroll
        scroll.echos = scroll.echos.filter(id => id.toString() !== echoId);
        await scroll.save();

        res.status(200).json({ message: "Echo removed from scroll", scroll });
    } catch (error) {
        console.log("Error in removeEchoFromCuration controller", error);
        res.status(500).json({ error: "Failed to remove echo from scroll" });
    }
};

// GET /scroll/:id/echos - get all echos from a scroll (with feed logic)
export const getScrollEchos = async (req, res) => {
    try {
        const scrollId = req.params.id;
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user._id;

        // Convert to numbers and validate
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 items per page
        const skip = (pageNum - 1) * limitNum;

        const scroll = await Scroll.findById(scrollId);

        if (!scroll) {
            return res.status(404).json({ error: "Scroll not found" });
        }

        // Check if user has access to this scroll
        const isCreator = scroll.creator.toString() === userId.toString();
        const hasSaved = scroll.savedBy.includes(userId);
        const isPublic = !scroll.isPrivate;

        // Allow access if: user is creator OR scroll is public OR user has saved it
        if (!isCreator && !isPublic && !hasSaved) {
            return res.status(403).json({ error: "Access denied" });
        }

        let echos = [];
        let total = 0;

        // For CURATION type: return manually added echos
        if (scroll.type === 'curation') {
            total = scroll.echos.length;
            echos = await Echo.find({ _id: { $in: scroll.echos } })
                .populate('author', 'userName')
                .populate('tags', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);
        }
        // For FEED type: build query based on feed config
        else if (scroll.type === 'feed') {
            const config = scroll.feedConfig || {};
            const query = {};

            // Tag filtering
            if (config.includedTags && Array.isArray(config.includedTags) && config.includedTags.length > 0) {
                if (config.tagMatchType === 'all') {
                    // Echo must have ALL included tags
                    query.tags = { $all: config.includedTags };
                } else if (config.tagMatchType === 'any') {
                    // Echo must have ANY of the included tags
                    query.tags = { $in: config.includedTags };
                }
            }

            // Excluded tags - use $and to combine with included tags
            if (config.excludedTags && Array.isArray(config.excludedTags) && config.excludedTags.length > 0) {
                if (query.tags) {
                    // If we already have tag filters, combine them with $and
                    const existingTagFilter = query.tags;
                    delete query.tags;
                    query.$and = [
                        { tags: existingTagFilter },
                        { tags: { $nin: config.excludedTags } }
                    ];
                } else {
                    query.tags = { $nin: config.excludedTags };
                }
            }

            // Author filtering
            if (config.authors && Array.isArray(config.authors) && config.authors.length > 0) {
                query.author = { $in: config.authors };
            }

            // Date range filtering
            if (config.dateRange && (config.dateRange.startDate || config.dateRange.endDate)) {
                query.createdAt = {};
                if (config.dateRange.startDate) {
                    query.createdAt.$gte = new Date(config.dateRange.startDate);
                }
                if (config.dateRange.endDate) {
                    query.createdAt.$lte = new Date(config.dateRange.endDate);
                }
            }

            // Exclude liked echos
            if (config.excludeLikedEchos) {
                query.likedBy = { $ne: userId };
            }

            // Time range for sorting (used with mostLiked)
            if (config.sortBy === 'mostLiked' && config.sortTimeRange && config.sortTimeRange !== 'allTime') {
                const now = new Date();
                let timeRangeDate = new Date();

                if (config.sortTimeRange === '1day') {
                    timeRangeDate.setDate(now.getDate() - 1);
                } else if (config.sortTimeRange === '1month') {
                    timeRangeDate.setMonth(now.getMonth() - 1);
                } else if (config.sortTimeRange === '1year') {
                    timeRangeDate.setFullYear(now.getFullYear() - 1);
                }

                if (!query.createdAt) {
                    query.createdAt = {};
                }
                query.createdAt.$gte = timeRangeDate;
            }

            // Get total count for pagination
            total = await Echo.countDocuments(query);

            // Execute query
            console.log("Feed configuration:", JSON.stringify(config, null, 2));
            console.log("Generated query:", JSON.stringify(query, null, 2));
            let echoQuery = Echo.find(query)
                .populate('author', 'userName')
                .populate('tags', 'name')
                .skip(skip)
                .limit(limitNum);

            // Apply sorting
            if (config.sortBy === 'mostLiked') {
                echoQuery = echoQuery.sort({ likes: -1, createdAt: -1 });
            } else if (config.sortBy === 'newestFirst') {
                echoQuery = echoQuery.sort({ createdAt: -1 });
            } else if (config.sortBy === 'oldestFirst') {
                echoQuery = echoQuery.sort({ createdAt: 1 });
            }

            echos = await echoQuery;
        }

        // Add isLiked status to each echo
        const echosWithLikes = echos.map(echo => ({
            ...echo.toObject(),
            isLiked: echo.likedBy.includes(userId)
        }));

        const hasMore = skip + limitNum < total;

        res.status(200).json({
            echos: echosWithLikes,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                hasMore
            },
            hasMore // For backwards compatibility
        });
    } catch (error) {
        console.log("Error in getScrollEchos controller", error);
        console.log("Error details:", error.message);
        console.log("Error stack:", error.stack);
        res.status(500).json({ error: "Failed to get scroll echos" });
    }
};

// POST /scroll/:id/follow - follow a scroll
export const followScroll = async (req, res) => {
    try {
        const scrollId = req.params.id;
        const userId = req.user._id;

        const scroll = await Scroll.findById(scrollId);
        if (!scroll) {
            return res.status(404).json({ error: "Scroll not found" });
        }

        // Can't follow private scrolls unless you're the creator
        if (scroll.isPrivate && scroll.creator.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Cannot follow private scroll" });
        }

        // Can't follow your own scroll
        if (scroll.creator.toString() === userId.toString()) {
            return res.status(400).json({ error: "Cannot follow your own scroll" });
        }

        // Check if already following
        if (scroll.savedBy.includes(userId)) {
            return res.status(200).json({
                message: "Already following scroll",
                isFollowing: true,
                followersCount: scroll.savedBy.length
            });
        }

        scroll.savedBy.push(userId);
        await scroll.save();

        res.status(200).json({
            message: "Scroll followed",
            isFollowing: true,
            followersCount: scroll.savedBy.length
        });
    } catch (error) {
        console.log("Error in followScroll controller", error);
        res.status(500).json({ error: "Failed to follow scroll" });
    }
};

// DELETE /scroll/:id/follow - unfollow a scroll
export const unfollowScroll = async (req, res) => {
    try {
        const scrollId = req.params.id;
        const userId = req.user._id;

        const scroll = await Scroll.findById(scrollId);
        if (!scroll) {
            return res.status(404).json({ error: "Scroll not found" });
        }

        // Check if not following
        if (!scroll.savedBy.includes(userId)) {
            return res.status(200).json({
                message: "Not following scroll",
                isFollowing: false,
                followersCount: scroll.savedBy.length
            });
        }

        scroll.savedBy = scroll.savedBy.filter(id => id.toString() !== userId.toString());
        await scroll.save();

        res.status(200).json({
            message: "Scroll unfollowed",
            isFollowing: false,
            followersCount: scroll.savedBy.length
        });
    } catch (error) {
        console.log("Error in unfollowScroll controller", error);
        res.status(500).json({ error: "Failed to unfollow scroll" });
    }
};
