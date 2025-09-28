import mongoose from "mongoose";

// create the database collection (table) for a user
const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
        },
        password: {
            type: String,
            required: true,
            minlength: 4
        },
    },
    { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
export default User;