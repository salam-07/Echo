import express from "express";

// controller functions
import {
    createScroll,
    getScrolls,
    getScrollById,
    deleteScroll,
    addEchoToCuration,
    removeEchoFromCuration,
    getScrollEchos
} from "../controllers/scroll.controller.js";

// protected route checking
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Scroll CRUD routes
router.post("/create", protectRoute, createScroll);
router.get("/all", protectRoute, getScrolls);
router.get("/:id", protectRoute, getScrollById);
router.delete("/:id", protectRoute, deleteScroll);

// Curation management routes
router.post("/:id/add-echo", protectRoute, addEchoToCuration);
router.delete("/:id/remove-echo/:echoId", protectRoute, removeEchoFromCuration);

// Get echos from a scroll (works for both curation and feed)
router.get("/:id/echos", protectRoute, getScrollEchos);

export default router;
