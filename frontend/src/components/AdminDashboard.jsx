import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService, orderService } from '../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [gameForm, setGameForm] = useState({
    title: '',
    price: '',
    platform: '',
    genre: '',
    stock: '',
    image: '',
  });

  useEffect(() => {
    if (activeTab === 'games') {
      fetchGames();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await gameService.getAllGames();
      setGames(data);
    } catch (err) {
      setError(err.message || 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleGameFormChange = (e) => {
    const { name, value } = e.target;
    setGameForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      const gameData = {
        ...gameForm,
        price: parseFloat(gameForm.price),
        stock: parseInt(gameForm.stock),
      };

      if (editingGame) {
        await gameService.updateGame(editingGame._id, gameData);
      } else {
        await gameService.addGame(gameData);
      }

      resetGameForm();
      fetchGames();
    } catch (err) {
      setError(err.message || 'Failed to save game');
    }
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setGameForm({
      title: game.title,
      price: game.price.toString(),
      platform: game.platform,
      genre: game.genre,
      stock: game.stock.toString(),
      image: game.image || '',
    });
    setShowGameForm(true);
  };

  const handleDeleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }

    try {
      await gameService.deleteGame(id);
      fetchGames();
    } catch (err) {
      setError(err.message || 'Failed to delete game');
    }
  };

  const resetGameForm = () => {
    setGameForm({
      title: '',
      price: '',
      platform: '',
      genre: '',
      stock: '',
      image: '',
    });
    setEditingGame(null);
    setShowGameForm(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setError('');
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      fetchOrders();
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-dashboard"
    >
      <div className="dashboard-header">
        <p>Manage Games and Orders</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-error-message"
          onClick={() => setError('')}
        >
          <span>⚠️ {error}</span>
          <button className="close-error">×</button>
        </motion.div>
      )}

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          Games
        </button>
        <button
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="tab-content"
        >
          {activeTab === 'games' && (
            <>
              <div className="content-header">
                <h2>Games</h2>
                <button
                  className="add-button"
                  onClick={() => setShowGameForm(!showGameForm)}
                >
                  {showGameForm ? 'Cancel' : '+ Add Game'}
                </button>
              </div>

              {showGameForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="game-form"
                  onSubmit={handleAddGame}
                >
                  <h3>{editingGame ? 'Update Game' : 'New Game Entry'}</h3>
                  <div className="form-row">
                    <input type="text" name="title" placeholder="Title" value={gameForm.title} onChange={handleGameFormChange} required />
                    <input type="number" name="price" placeholder="Credits" value={gameForm.price} onChange={handleGameFormChange} step="0.01" required />
                  </div>
                  <div className="form-row">
                    <input type="text" name="platform" placeholder="Platform" value={gameForm.platform} onChange={handleGameFormChange} required />
                    <input type="text" name="genre" placeholder="Genre" value={gameForm.genre} onChange={handleGameFormChange} required />
                  </div>
                  <div className="form-row">
                    <input type="number" name="stock" placeholder="Stock" value={gameForm.stock} onChange={handleGameFormChange} required />
                    <input type="text" name="image" placeholder="Image" value={gameForm.image} onChange={handleGameFormChange} />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-button">
                      {editingGame ? 'Update Game' : 'Add Game'}
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="games-table">
                <table>
                  <thead>
                    <tr>
                      <th>Game</th>
                      <th>Price</th>
                      <th>Platform</th>
                      <th>Genre</th>
                      <th>Stock</th>
                      {/* <th>Image</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game) => (
                      <tr key={game._id}>
                        <td>{game.title}</td>
                        <td>${game.price}</td>
                        <td>{game.platform}</td>
                        <td>{game.genre}</td>
                        <td>{game.stock}</td>
                        <td className="actions">
                          <button className="edit-btn" onClick={() => handleEditGame(game)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDeleteGame(game._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <div className="content-header">
                <h2>Transaction Logs</h2>
              </div>
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Manifest</th>
                      <th>Total</th>
                      <th>Status Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="order-id">{order._id.substring(0, 8)}...</td>
                        <td>{order.user?.name || 'Anon'}<br /><small>{order.user?.email}</small></td>
                        <td>{order.items?.length || 0} Units</td>
                        <td>${order.totalAmount?.toFixed(2)}</td>
                        <td>
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;
