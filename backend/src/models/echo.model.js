import mongoose from "mongoose";

// create the database collection (table) for a user
const echoSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: 1000
        },
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
            index: true
        }],
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        }],
        likes: {
            type: Number,
            default: 0,
        },
        dislikes: {
            type: Number,
            default: 0,
        },
        replies: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            comment: {
                type: String,
                required: true,
                maxlength: 500
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
    },
    { timestamps: true }
);

const Echo = new mongoose.model("Echo", echoSchema);
export default Echo;