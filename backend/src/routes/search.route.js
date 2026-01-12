import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { searchUsers, searchAll, searchEchos, searchScrolls } from "../controllers/search.controller.js";

const router = express.Router();

// Search routes
router.get("/", protectRoute, searchAll);
router.get("/users", protectRoute, searchUsers);
router.get("/echos", protectRoute, searchEchos);
router.get("/scrolls", protectRoute, searchScrolls);

export default router;
