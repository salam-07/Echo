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

        const query = Tag.find({}).sort({ name: 1 }).lean();

        if (limitNum) {
            query.limit(limitNum);
        }

        const tags = await query;

        // Count how many echos reference each tag. Each echo carries an array of
        // tag references, so unwinding and grouping gives the usage count per tag.
        const counts = await Echo.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } }
        ]);
        const countByTag = new Map(counts.map((c) => [String(c._id), c.count]));

        const tagsWithCount = tags.map((tag) => ({
            ...tag,
            count: countByTag.get(String(tag._id)) || 0,
        }));

        res.status(200).json(tagsWithCount);
    } catch (error) {
        console.log("Error in getTags controller", error);
        res.status(500).json({ error: "Failed to fetch tags" });
    }
};

// GET /community/tags/random - A random handful of tags that are provably in use
//
// The welcome sheet offers tags to build a first Feed from, and it needs a fresh
// set every time it asks — the same eight names for every reader, every visit, is
// the one thing that sheet cannot survive. So the draw is random, and the order
// of the pipeline is what makes it cheap.
//
// It samples Echoes, not Tags. That is the whole trick: a name reaches the
// response only because an Echo in the sample carried it, so "in use" is a
// property of the query rather than a second pass to verify. Tag documents know
// nothing about their own usage, and counting it — what GET /tags has to do to
// return a count — means unwinding and grouping every tag in the corpus before
// it can answer anything. Here the group runs over one short sample instead.
//
// The sizes are deliberately asymmetric. Four Echoes are sampled per name asked
// for, because Echoes share tags and a pool that only just clears the limit
// collapses to almost no variety; the second $sample is what trims that surplus
// back down. Both are cheap because $sample reaches into the collection at
// random rather than sorting it — and it is first in the pipeline, which is the
// only position where that holds.
//
// Responds with bare names, not documents: the caller renders `#name` and nothing
// else, and a tag carries nothing else worth sending.
export const getRandomTags = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 24, 1), 60);
        const poolNum = Math.min(limitNum * 4, 400);

        const tags = await Echo.aggregate([
            { $sample: { size: poolNum } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags" } },
            { $sample: { size: limitNum } },
            {
                $lookup: {
                    from: Tag.collection.name,
                    localField: "_id",
                    foreignField: "_id",
                    as: "tag",
                },
            },
            { $unwind: "$tag" },
            { $project: { _id: 0, name: "$tag.name" } },
        ]);

        res.status(200).json(tags.map((tag) => tag.name));
    } catch (error) {
        console.log("Error in getRandomTags controller", error);
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