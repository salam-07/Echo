import express from "express";

// controller functions
import { postEcho, deleteEcho, getAllEcho, viewEcho, likeEcho, unlikeEcho, getEchosByTag, addReply, deleteReply, getReplies } from "../controllers/echo.controller.js";
// protected route checking
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


// echo posting route
router.post("/post", protectRoute, postEcho);
router.delete("/delete/:id", protectRoute, deleteEcho);
router.get("/all", protectRoute, getAllEcho);
router.get("/echo/:id", protectRoute, viewEcho);
router.get("/tag/:tagName", protectRoute, getEchosByTag);

// like/unlike routes
router.post("/like/:id", protectRoute, likeEcho);
router.delete("/like/:id", protectRoute, unlikeEcho);

// reply routes
router.post("/:id/reply", protectRoute, addReply);
router.delete("/:id/reply/:replyId", protectRoute, deleteReply);
router.get("/:id/replies", protectRoute, getReplies);

export default router;