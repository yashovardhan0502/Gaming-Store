import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.route.js";
import gameRoutes from "./src/routes/game.route.js";
import orderRoutes from "./src/routes/order.route.js";
import cartRoutes from "./src/routes/cart.route.js";

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Gaming Store API Live" });
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});