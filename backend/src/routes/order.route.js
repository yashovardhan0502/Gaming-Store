import express from "express";

import { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/my", protect, getMyOrders);

router.get("/", protect, adminOnly, getAllOrders);

router.put("/:id", protect, adminOnly, updateOrderStatus);

export default router;