import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gameService } from '../api';
import { addToCart, getCart } from '../api/cartService';
import { useNotification } from './NotificationContext';
import './GameList.css';

const GameList = () => {
  const { showNotification } = useNotification();
  const [games, setGames] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    platform: '',
    sort: 'newest',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInitialData();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [gamesData, cartData] = await Promise.all([
        gameService.getAllGames(filters),
        getCart().catch(() => []) // Handle case where user isn't logged in
      ]);
      setGames(gamesData);
      setCartItems(cartData || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      showNotification(err.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getAvailableStock = (game) => {
    const itemInCart = cartItems.find(item =>
      item.game && (item.game._id || item.game) === game._id
    );
    const cartQty = itemInCart ? itemInCart.quantity : 0;
    return Math.max(0, game.stock - cartQty);
  }

  const handleAddToCart = async (gameId) => {
    try {
      await addToCart(gameId);
      showNotification("Game added to cart!", "success");
      const updatedCart = await getCart();
      setCartItems(updatedCart || []);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to cart!";
      showNotification(msg, "error");
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  if (loading) {
    return (
      <div className="game-list-container loading-state">
        <div className="spinner"></div>
        <p>Loading Inventory...</p>
      </div>
    );
  }

  return (
    <div className="game-list-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-list-header"
      >
        <motion.h1
          initial={{ letterSpacing: "10px", opacity: 0 }}
          animate={{ letterSpacing: "-1px", opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Featured Titles
        </motion.h1>
        <p>Discover premium digital experiences.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="filters-section"
      >
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            name="search"
            placeholder="Search titles..." 
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Genre</label>
            <select name="genre" value={filters.genre} onChange={handleFilterChange}>
              <option value="">All Genres</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="RPG">RPG</option>
              <option value="Shooter">Shooter</option>
              <option value="Strategy">Strategy</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Platform</label>
            <select name="platform" value={filters.platform} onChange={handleFilterChange}>
              <option value="">All Platforms</option>
              <option value="PC">PC</option>
              <option value="PlayStation">PlayStation</option>
              <option value="Xbox">Xbox</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input 
                type="number" 
                name="minPrice" 
                placeholder="Min" 
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <input 
                type="number" 
                name="maxPrice" 
                placeholder="Max" 
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </motion.div>

      {games.length === 0 ? (
        <div className="empty-state">
          <p>The store is currently empty. Check back later.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="game-grid"
        >
          {games.map((game) => {
            const availableStock = getAvailableStock(game);
            return (
              <motion.div
                key={game._id}
                variants={itemVariants}
                className="game-card"
              >
                <div className="game-image">
                  {game.image ? (
                    <img src={game.image} alt={game.title} />
                  ) : (
                    <div className="no-image">No Image Available</div>
                  )}
                </div>

                <div className="game-content">
                  <h3 className="game-title">{game.title}</h3>

                  <div className="game-info">
                    <span className="game-platform">{game.platform}</span>
                    <span className="game-genre">{game.genre}</span>
                  </div>

                  <div className="game-footer">
                    <span className="game-price">${game.price.toFixed(2)}</span>
                    <span className={`game-stock ${availableStock === 0 ? 'out-of-stock' : ''}`}>
                      {availableStock > 0 ? `${availableStock} In Stock` : 'Out of Stock'}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="buy-button"
                    disabled={availableStock === 0}
                    onClick={() => handleAddToCart(game._id)}
                  >
                    {availableStock > 0 ? ' Add to Cart' : 'Sold Out'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default GameList;
