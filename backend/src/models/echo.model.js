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
        likes: {
            type: Number,
            default: 0,
        }
    },
    { timestamps: true }
);

const Echo = new mongoose.model("Echo", echoSchema);
export default Echo;