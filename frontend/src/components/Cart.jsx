import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCart, removeFromCart, updateQuantity, checkOut, createStripeSession } from "../api/cartService.js";
import { useNotification } from "./NotificationContext.jsx";
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await getCart();
            setCart(data || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
            showNotification("Failed to fetch cart", "error");
        } finally {
            setLoading(false);
        }
    }

    const handleRemove = async (gameId) => {
        try {
            await removeFromCart(gameId);
            showNotification("Item removed from cart", "info");
            fetchCart();
        } catch (error) {
            showNotification("Failed to remove item", "error");
        }
    }

    const handleQuantity = async (gameId, quantity) => {
        if (quantity < 1) return;
        try {
            await updateQuantity(gameId, quantity);
            fetchCart();
        } catch (error) {
            showNotification("Failed to update quantity", "error");
        }
    }

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            const { url } = await createStripeSession();
            window.location.href = url;
        } catch (error) {
            console.error("Stripe error:", error);
            showNotification("Failed to start checkout", "error");
        }
    }

    const subtotal = cart.reduce(
        (total, item) => total + (item.game.price * item.quantity), 0
    );

    if (loading) {
        return (
            <div className="cart-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Retrieving your inventory...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cart-container"
        >
            <header className="cart-header">
                <motion.h1
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    Shopping Cart
                </motion.h1>
            </header>

            {cart.length === 0 ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="empty-cart"
                >
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your inventory is empty</h2>
                    <p>Gear up! Explore our legendary collection of games.</p>
                    <Link to="/games" className="continue-shopping">
                        Browse Games
                    </Link>
                </motion.div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div
                                    key={item.game._id}
                                    layout
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 50, opacity: 0 }}
                                    className="cart-item"
                                >
                                    <div className="cart-item-image">
                                        {item.game.image ? (
                                            <img src={item.game.image} alt={item.game.title} />
                                        ) : (
                                            <div className="no-image">No Sync</div>
                                        )}
                                    </div>
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-title">{item.game.title}</h3>
                                        <p className="cart-item-price">${item.game.price.toFixed(2)}</p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-control">
                                            <label className="qty-label">Qty</label>
                                            <input
                                                type="number"
                                                className="quantity-input"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) =>
                                                    handleQuantity(item.game._id, parseInt(e.target.value))
                                                }
                                            />
                                        </div>
                                        <button
                                            className="remove-button"
                                            onClick={() => handleRemove(item.game._id)}
                                        >
                                            Discard
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <motion.aside
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="cart-summary"
                    >
                        <h2 className="summary-title">Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>FREE</span>
                        </div>
                        <div className="summary-total">
                            <span className="summary-total-label">Total Amount</span>
                            <span className="summary-total-amount">${subtotal.toFixed(2)}</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="checkout-button"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </motion.button>
                    </motion.aside>
                </div>
            )}
        </motion.div>
    );
};

export default Cart;
