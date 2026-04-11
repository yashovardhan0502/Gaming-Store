import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Game from "./src/models/game.model.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Read the games.json file
        const gamesData = JSON.parse(fs.readFileSync("./games.json", "utf-8"));

        // Clear existing games (optional, but good for testing)
        await Game.deleteMany({});
        console.log("Cleared existing games.");

        // Insert new games
        await Game.insertMany(gamesData);
        console.log(`Successfully seeded ${gamesData.length} games!`);

        // Close the connection
        await mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
