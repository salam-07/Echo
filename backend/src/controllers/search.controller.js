import User from "../models/user.model.js";

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
