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
        type: {
            type: String,
            enum: ['curation', 'feed'],
            required: true
        },
        isPrivate: {
            type: Boolean,
            default: false
        },

        // For CURATION type: manually added echos
        echos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Echo'
        }],

        // For FEED type: configuration options
        feedConfig: {
            // Tag filtering
            tagMatchType: {
                type: String,
                enum: ['all', 'any', 'none'],
                default: 'any'
            },
            includedTags: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag'
            }],
            excludedTags: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag'
            }],

            // Author filtering
            authors: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],

            // Date range filtering
            dateRange: {
                startDate: { type: Date },
                endDate: { type: Date }
            },

            // Sorting options
            sortBy: {
                type: String,
                enum: ['mostLiked', 'newestFirst', 'oldestFirst'],
                default: 'newestFirst'
            },

            // Time range for sorting (used with mostLiked)
            sortTimeRange: {
                type: String,
                enum: ['1day', '1month', '1year', 'allTime'],
                default: 'allTime'
            },

            // Additional filters
            excludeLikedEchos: {
                type: Boolean,
                default: false
            }
        },

        savedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    { timestamps: true }
);

const Scroll = new mongoose.model("Scroll", scrollSchema);
export default Scroll;
