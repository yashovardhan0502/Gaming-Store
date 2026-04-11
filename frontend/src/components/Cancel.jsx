import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Cancel.css";

const Cancel = () => {
    return (
        <div className="cancel-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="cancel-card"
            >
                <div className="cancel-icon">❌</div>
                <h1 className="cancel-title">Payment Cancelled</h1>
                <p className="cancel-message">
                    Your payment was not completed. Don't worry, your cart is still waiting for you!
                </p>
                <div className="cancel-actions">
                    <Link to="/cart" className="action-btn primary">
                        Return to Cart
                    </Link>
                    <Link to="/games" className="action-btn secondary">
                        Back to Store
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Cancel;
