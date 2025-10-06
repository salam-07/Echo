import express from "express";

// controller functions
import { getProfile, getMyProfile, getFollowers, getFollowing, getEchos, getScrolls } from "../controllers/profile.controller.js";
// protected route checking
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user/:id", protectRoute, getProfile);
router.get("/me", protectRoute, getMyProfile);
router.get("/user/:id/followers", protectRoute, getFollowers);
router.get("/user/:id/following", protectRoute, getFollowing);
router.get("/user/:id/echos", protectRoute, getEchos);
router.get("/user/:id/scrolls", protectRoute, getScrolls);

export default router;