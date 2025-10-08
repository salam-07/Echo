import express from "express";

// controller functions
import { postEcho, deleteEcho, getAllEcho, viewEcho, likeEcho, unlikeEcho } from "../controllers/echo.controller.js";
// protected route checking
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


// echo posting route
router.post("/post", protectRoute, postEcho);
router.delete("/delete/:id", protectRoute, deleteEcho);
router.get("/all", protectRoute, getAllEcho);
router.get("/echo/:id", protectRoute, viewEcho);

// like/unlike routes
router.post("/like/:id", protectRoute, likeEcho);
router.delete("/like/:id", protectRoute, unlikeEcho);

export default router;