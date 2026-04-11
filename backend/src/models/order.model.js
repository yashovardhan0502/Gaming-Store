import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    items: [
        {
            game: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Game",
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    stripeSessionId: {
        type: String,
        unique: true,
        sparse: true,
    },
},
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);