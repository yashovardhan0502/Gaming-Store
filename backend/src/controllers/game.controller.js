import Game from "../models/game.model.js";

export const addGame = async (req, res) => {
    try {
        const { title, price, platform, genre, stock, image } = req.body;

        const game = await Game.create({
            title,
            price,
            platform,
            genre,
            stock,
            image,
        });

        res.status(201).json(game);
    } catch (error) {
        console.error("Add Game Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllGames = async (req, res) => {
    try {
        const { search, genre, platform, minPrice, maxPrice, sort } = req.query;
        let query = {};

        // Search by title
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // Filter by genre
        if (genre) {
            query.genre = genre;
        }

        // Filter by platform
        if (platform) {
            query.platform = platform;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let apiQuery = Game.find(query);

        // Sorting
        if (sort) {
            const sortOptions = {
                "price-asc": { price: 1 },
                "price-desc": { price: -1 },
                "rating": { rating: -1 },
                "newest": { createdAt: -1 }
            };
            apiQuery = apiQuery.sort(sortOptions[sort] || { createdAt: -1 });
        } else {
            apiQuery = apiQuery.sort({ createdAt: -1 });
        }

        const games = await apiQuery;
        res.json(games);
    } catch (error) {
        console.error("Get All Games Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(400).json({ message: "Game Not Found" });
        }
        res.json(game);
    } catch (error) {
        console.error("Get Game By Id Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(400).json({ message: "Game Not Found" });
        }

        game.title = req.body.title || game.title;
        game.price = req.body.price || game.price;
        game.platform = req.body.platform || game.platform;
        game.genre = req.body.genre || game.genre;
        game.stock = req.body.stock || game.stock;
        game.image = req.body.image || game.image;

        const updatedGame = await game.save();
        res.json(updatedGame);
    } catch (error) {
        console.error("Update Game Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(400).json({ message: "Game Not Found" });
        }

        await game.deleteOne();
        res.json({ message: "Game removed!" });
    } catch (error) {
        console.error("Delete Game Error:", error);
        res.status(500).json({ message: error.message });
    }
};