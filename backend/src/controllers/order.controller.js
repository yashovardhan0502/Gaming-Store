import Order from "../models/order.model.js";
import Game from "../models/game.model.js";

export const placeOrder = async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, paymentStatus } = req.body;

        if (!paymentMethod) {
            return res.status(400).json({ message: "Payment method is required!" });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No order items to place!" });
        }

        for (const item of items) {
            const game = await Game.findById(item.game);

            if (!game) {
                return res.status(404).json({ message: "Game Not Found!" });
            }

            if (game.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${game.title}`
                });
            };
        }

        for (const item of items) {
            const game = await Game.findById(item.game);

            game.stock -= item.quantity;
            await game.save();
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentStatus || "Completed",
        });

        res.status(201).json(order);

    } catch (error) {
        console.error("Place Order Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).populate("items.game");

        res.json(orders || []);
    } catch (error) {
        console.error("Get My Orders Error:", error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").populate("items.game", "title price image");
        res.json(orders);
    } catch (error) {
        console.error("Get All Orders Error:", error);
        res.status(500).json({ message: error.message });
    }
};

//Admin access only
export const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await Order.findById(orderId); // Added await here

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ message: error.message });
    }
};