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
        bio: {
            type: String,
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],

        savedScrolls: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Scroll'
        }],
        createdScrolls: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Scroll'
        }]
    },
    { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
export default User;