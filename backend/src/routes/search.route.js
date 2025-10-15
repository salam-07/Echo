import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { searchUsers } from "../controllers/search.controller.js";

const router = express.Router();

// Search routes
router.get("/users", protectRoute, searchUsers);

export default router;
