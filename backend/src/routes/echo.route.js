import express from "express";

// controller functions
import { postEcho, deleteEcho, getAllEcho, viewEcho } from "../controllers/echo.controller.js";
// protected route checking
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


// echo posting route
router.post("/post", protectRoute, postEcho);
router.delete("/delete/:id", protectRoute, deleteEcho);
router.get("/all", protectRoute, getAllEcho);
router.get("/echo/:id", protectRoute, viewEcho);

export default router;