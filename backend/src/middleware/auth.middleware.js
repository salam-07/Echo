import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ mesage: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ mesage: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password").lean();

        if (!user) {
            return res.status(404).json({ message: "No User Found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware", error);
        res.status(500).json({ mesage: "Internal Server Error" });
    }
};