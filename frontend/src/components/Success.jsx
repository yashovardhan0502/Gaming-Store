import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { confirmPayment } from "../api/cartService";
import { useNotification } from "./NotificationContext";
import "./Success.css";

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const processedRef = useRef(false);

    useEffect(() => {
        if (sessionId && !processedRef.current) {
            processedRef.current = true;
            handleConfirmPayment();
        } else if (!sessionId) {
            setLoading(false);
        }
    }, [sessionId]);

    const handleConfirmPayment = async () => {
        try {
            await confirmPayment(sessionId);
            showNotification("Order finalized and stock updated!", "success");
            setLoading(false);
        } catch (err) {
            console.error("Confirmation error:", err);
            setError(true);
            setLoading(false);
            showNotification("Failed to finalize order. Please contact support.", "error");
        }
    };

    if (loading) {
        return (
            <div className="success-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Finalizing your order... Please do not refresh.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="success-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-card"
            >
                <div className="success-icon">{error ? "⚠️" : "✔️"}</div>
                <h1 className="success-title">
                    {error ? "Action Required" : "Payment Successful!"}
                </h1>
                <p className="success-message">
                    {error
                        ? "There was an issue finalizing your order in our system, but your payment was successful. Please contact support."
                        : "Thank you for your purchase. Your legendary loot is being prepared and stock has been updated!"}
                </p>
                {sessionId && (
                    <div className="session-id">
                        Order Ref: <span>{sessionId.slice(-10)}</span>
                    </div>
                )}
                <div className="success-actions">
                    <Link to="/my-orders" className="action-btn primary">
                        View My Orders
                    </Link>
                    <Link to="/games" className="action-btn secondary">
                        Back to Store
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Success;
