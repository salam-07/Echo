// package imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import echoRoutes from "./routes/echo.route.js";
import profileRoutes from "./routes/profile.route.js";
import scrollRoutes from "./routes/scroll.route.js";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
// cors policy for dev - allow local network access  
app.use(cors(
    {
        origin: ["http://localhost:5173", /^http:\/\/192\.(16|168)\.10\.\d+:5173$/],
        credentials: true
    }
));

// routes
app.use("/api/auth", authRoutes); // routes for auth
app.use("/api/echo", echoRoutes); // routes for posting
app.use("/api/profile", profileRoutes); // routes for posting
app.use("/api/scroll", scrollRoutes); // routes for scrolls


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running on port", PORT);
    console.log("Network access enabled for 192.168.10.x");
    connectDB();
});
