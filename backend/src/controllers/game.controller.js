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

export const createGameReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        const alreadyReviewed = game.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: "You already reviewed this game" });
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        game.reviews.push(review);

        game.numReviews = game.reviews.length;

        game.rating =
            game.reviews.reduce((acc, item) => item.rating + acc, 0) /
            game.reviews.length;

        await game.save();
        res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
        console.error("Create Game Review Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteGameReview = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        const reviewIndex = game.reviews.findIndex(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Review not found" });
        }

        game.reviews.splice(reviewIndex, 1);
        game.numReviews = game.reviews.length;

        if (game.numReviews === 0) {
            game.rating = 0;
        } else {
            game.rating =
                game.reviews.reduce((acc, item) => item.rating + acc, 0) /
                game.reviews.length;
        }

        await game.save();
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete Game Review Error:", error);
        res.status(500).json({ message: error.message });
    }
};