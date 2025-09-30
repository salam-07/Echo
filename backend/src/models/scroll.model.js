import mongoose from "mongoose";

const scrollSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        description: {
            type: String,
        },
        criteria: {
            creators: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }], // follow specific people
            tags: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag',
            }], // topic filters
            timeFrame: {
                from: { type: Date },
                to: { type: Date }
            }
        },

        sortType: {
            type: String,
            enum: ['random', 'time', 'custom'],
            default: 'random'
        },

        customOrder: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Echo'
        }], // only if custom sort

        hiddenPosts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Echo'
        }], // “hide viewed posts”

        savedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    { timestamps: true }
);

const Scroll = new mongoose.model("Scroll", scrollSchema);
export default Scroll;