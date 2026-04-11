import express from "express";
import { addToCart, getCart, removeFromCart, updateQuantity, checkOut, createStripeSession, confirmPayment } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/:gameId", protect, removeFromCart);
router.put("/:gameId", protect, updateQuantity);
router.post("/checkout", protect, checkOut);
router.post("/stripe-session", protect, createStripeSession);
router.post("/confirm-payment", protect, confirmPayment);

export default router;