import Scroll from "../models/scroll.model.js";
import Echo from "../models/echo.model.js";
import Tag from "../models/tag.model.js";

// GET /community/scrolls/feed - Get public feed scrolls
export const getPublicFeedScrolls = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNum = limit ? parseInt(limit) : null;

        const query = Scroll.find({
            isPrivate: false,
            type: 'feed'
        })
            .populate('creator', 'userName bio')
            .populate('feedConfig.includedTags', 'name')
            .populate('feedConfig.authors', 'userName')
            .sort({ createdAt: -1 }); if (limitNum) {
                query.limit(limitNum);
            }

        const feedScrolls = await query;

        res.status(200).json(feedScrolls);
    } catch (error) {
        console.log("Error in getPublicFeedScrolls controller", error);
        res.status(500).json({ error: "Failed to fetch public feed scrolls" });
    }
};

// GET /community/scrolls/curation - Get public curation scrolls
export const getPublicCurationScrolls = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNum = limit ? parseInt(limit) : null;

        const query = Scroll.find({
            isPrivate: false,
            type: 'curation'
        })
            .populate('creator', 'userName bio')
            .populate('echos')
            .sort({ createdAt: -1 }); if (limitNum) {
                query.limit(limitNum);
            }

        const curationScrolls = await query;

        res.status(200).json(curationScrolls);
    } catch (error) {
        console.log("Error in getPublicCurationScrolls controller", error);
        res.status(500).json({ error: "Failed to fetch public curation scrolls" });
    }
};

// GET /community/tags - Get all tags
export const getTags = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNum = limit ? parseInt(limit) : null;

        const query = Tag.find({}).sort({ name: 1 });

        if (limitNum) {
            query.limit(limitNum);
        }

        const tags = await query;

        res.status(200).json(tags);
    } catch (error) {
        console.log("Error in getTags controller", error);
        res.status(500).json({ error: "Failed to fetch tags" });
    }
};

// GET /community/echos/popular - Get popular echos
export const getPopularEchos = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNum = limit ? parseInt(limit) : null;

        // Calculate popularity based on likes count and recency
        // You can adjust this algorithm based on your needs
        const query = Echo.find({})
            .populate('author', 'userName bio')
            .populate('tags', 'name')
            .sort({
                likes: -1,      // Sort by likes count first
                createdAt: -1   // Then by recency
            }); if (limitNum) {
                query.limit(limitNum);
            }

        const popularEchos = await query;

        res.status(200).json(popularEchos);
    } catch (error) {
        console.log("Error in getPopularEchos controller", error);
        res.status(500).json({ error: "Failed to fetch popular echos" });
    }
};