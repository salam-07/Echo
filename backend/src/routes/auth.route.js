import express from "express";

// controller functions
import { checkAuth, login, logout, signup } from "../controllers/auth.controller.js";
// protected route checking
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// if authenticated, then calls next function
router.get("/check", protectRoute, checkAuth);

export default router;