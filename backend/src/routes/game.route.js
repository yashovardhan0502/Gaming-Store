import express from "express";

import { addGame, deleteGame, updateGame, getAllGames, getGameById, createGameReview, deleteGameReview } from "../controllers/game.controller.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllGames);

router.post("/", protect, adminOnly, addGame);

router.get("/:id", getGameById);

router.put("/:id", protect, adminOnly, updateGame);

router.delete("/:id", protect, adminOnly, deleteGame);

router.post("/:id/reviews", protect, createGameReview);

router.delete("/:id/reviews", protect, deleteGameReview);

export default router;