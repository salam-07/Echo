import mongoose from "mongoose";

// create the database collection (table) for a user
const tagSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, index: true },
    },
    { timestamps: true }
);

const Tag = new mongoose.model("Tag", tagSchema);
export default Tag;