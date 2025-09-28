// package imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./config/db.js";

import adminRoutes from "./routes/admin.route.js";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));

// routes
app.use("/api/auth", authRoutes); // routes for auth

app.use(express.json());
app.use(rateLimiter);



// app.use((req, res, next) => {
//   console.log("We just got a new request: ", req.method);
//   next();
// });

app.use("/api/notes", notesRoutes);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
    connectDB();
});
