import express from "express";

// controller functions
import {
    getPublicFeedScrolls,
    getPublicCurationScrolls,
    getTags,
    getPopularEchos
} from "../controllers/community.controller.js";

// Note: Community routes are generally public, no auth middleware needed
// If you want to protect any routes, import protectRoute and use it

const router = express.Router();

// Public scroll routes
router.get("/scrolls/public/feed", getPublicFeedScrolls);
router.get("/scrolls/public/curation", getPublicCurationScrolls);

// Tags routes
router.get("/tags", getTags);

// Popular echos routes
router.get("/echos/popular", getPopularEchos);

export default router;