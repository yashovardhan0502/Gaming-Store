import Game from "../models/game.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log("Stripe Key Loaded:", process.env.STRIPE_SECRET_KEY ? "Yes" : "No");

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { gameId } = req.body;

        const user = await User.findById(userId);
        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(400).json({ message: "Game Not Found!" });
        }

        const itemIndex = user.cart.findIndex((item) => item.game.toString() === gameId);

        if (itemIndex > -1) {
            const currentQty = user.cart[itemIndex].quantity;

            if (currentQty + 1 > game.stock) {
                return res.status(400).json({
                    message: `Only ${game.stock} items available in stock. You already have ${currentQty} in cart.`
                });
            }
            user.cart[itemIndex].quantity += 1;
        } else {
            if (game.stock < 1) {
                return res.status(400).json({ message: "Game is out of stock!" });
            }
            user.cart.push({ game: gameId, quantity: 1 });
        }

        await user.save();

        res.status(200).json({ message: "Game added to cart", cart: user.cart });

    } catch (error) {
        console.error("Add To Cart Error:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("cart.game");

        // Filter out items where the game has been deleted
        const initialCount = user.cart.length;
        user.cart = user.cart.filter(item => item.game !== null);

        // If items were removed, save the cleaned cart back to the user
        if (user.cart.length < initialCount) {
            await User.findByIdAndUpdate(req.user._id, { cart: user.cart });
        }

        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { gameId } = req.params;

        const user = await User.findById(req.user._id);

        user.cart = user.cart.filter(
            (item) => item.game.toString() !== gameId
        );

        await user.save();

        res.status(200).json({ message: "Game removed!", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { quantity } = req.body;


        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be atleast 1!" });
        }

        const user = await User.findById(req.user._id);

        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(400).json({ message: "Game not found!" });
        }

        if (quantity > game.stock) {
            return res.status(400).json({ message: `Only ${game.stock} items available in stock` });
        }

        const item = user.cart.find((item) => item.game.toString() === gameId)

        if (!item) {
            return res.status(400).json({ message: "Game not in cart" });
        }

        item.quantity = quantity;

        await user.save();

        const updatedUser = await User.findById(req.user._id).populate("cart.game");
        res.status(200).json(updatedUser.cart);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkOut = async (req, res) => {
    try {
        const { paymentMethod, paymentStatus } = req.body;

        if (!paymentMethod) {
            return res.status(400).json({ message: "Payment method is required!" });
        }

        const user = await User.findById(req.user._id).populate("cart.game");

        if (user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty!" });
        }

        const totalAmount = user.cart.reduce((total, item) => {
            return total + item.game.price * item.quantity;
        }, 0);

        // Deduct stock and verify availability
        for (const item of user.cart) {
            const game = await Game.findById(item.game._id);
            if (game.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${game.title}!` });
            }
            game.stock -= item.quantity;
            await game.save();
        }

        const order = await Order.create({
            user: user._id,
            items: user.cart,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentStatus || "Completed",
        });

        user.cart = [];
        await user.save();

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createStripeSession = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("cart.game");

        // Filter out items where the game has been deleted
        const validItems = user.cart.filter(item => item.game !== null);

        if (validItems.length === 0) {
            return res.status(400).json({ message: "Cart contains no valid items!" });
        }

        const totalOrderAmount = validItems.reduce((total, item) => total + item.game.price * item.quantity, 0);
        if (totalOrderAmount < 0.50) {
            return res.status(400).json({ message: "Min. spend $0.50 required by Stripe. Power up your cart!" });
        }

        const line_items = validItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.game.title,
                },
                unit_amount: Math.round(item.game.price * 50),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            metadata: {
                userId: user._id.toString(),
            },
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Stripe Session Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const confirmPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not completed" });
        }

        const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
        if (existingOrder) {
            return res.status(200).json({ message: "Order already processed", order: existingOrder });
        }

        const user = await User.findById(req.user._id).populate("cart.game");

        if (!user || user.cart.length === 0) {
            return res.status(400).json({ message: "No items in cart to finalize" });
        }

        const validItems = user.cart.filter(item => item.game !== null);

        if (validItems.length === 0) {
            return res.status(400).json({ message: "No valid games in cart" });
        }

        const totalAmount = validItems.reduce((total, item) => total + item.game.price * item.quantity, 0);

        for (const item of validItems) {
            const game = await Game.findById(item.game._id);
            if (game.stock < item.quantity) {
                console.error(`Over-sale detected for ${game.title}`);
            }
            game.stock = Math.max(0, game.stock - item.quantity);
            await game.save();
        }

        const order = await Order.create({
            user: user._id,
            items: validItems.map(item => ({
                game: item.game._id,
                quantity: item.quantity
            })),
            totalAmount,
            paymentMethod: "Stripe",
            paymentStatus: "Completed",
            stripeSessionId: sessionId
        });

        user.cart = [];
        await user.save();

        res.status(201).json({ message: "Order finalized successfully", order });

    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        res.status(500).json({ message: error.message });
    }
};