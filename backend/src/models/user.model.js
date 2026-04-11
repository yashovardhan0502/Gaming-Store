import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    },

    cart : [
        {
            game: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Game",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }
    ],
},
    { timestamps: true }
);

export default mongoose.model("User", userSchema);