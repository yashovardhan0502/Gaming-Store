import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    platform: {
        type: String,
        enum: ["PC", "pc", "PlayStation", "PS5", "Xbox", "Xbox Series X", "Nintendo Switch"],
        required: true,
    },

    genre: {
        type: String,
        required: true,
    },

    stock: {
        type: Number,
        default: 0,
    },

    image: {
        type: String,
        required: true,
    },

    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    reviews: [reviewSchema],

    numReviews: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

export default mongoose.model("Game", gameSchema);