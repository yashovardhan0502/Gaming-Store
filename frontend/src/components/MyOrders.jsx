import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../api';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load your orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#fbbf24',
      Processing: '#3b82f6',
      Shipped: '#8b5cf6',
      Delivered: '#22c55e',
      Cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button onClick={fetchMyOrders} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your game orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-illustration-wrapper">
            <img
              src="/assets/no_orders.png"
              alt="No Orders Found"
              className="empty-illustration"
            />
          </div>
          <h3>Your quest for games hasn't started yet!</h3>
          <p>Once you purchase games, they'll appear here for your records.</p>
          <Link to="/games" className="browse-link">
            Explore Games
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <span className="label">Order ID:</span>
                  <span className="value">{order._id}</span>
                </div>
                <div
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status || 'Pending'}
                </div>
              </div>

              <div className="order-date">
                <span className="label">Placed on:</span>
                <span className="value">{formatDate(order.createdAt)}</span>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items && order.items.length > 0 ? (
                  <ul className="items-list">
                    {order.items.map((item, index) => (
                      <li key={index} className="order-item">
                        <div className="item-info">
                          {item.game?.image && (
                            <img
                              src={item.game.image}
                              alt={item.game?.title || 'Game'}
                              className="item-image"
                            />
                          )}
                          <div className="item-details">
                            <span className="item-title">
                              {item.game?.title || 'Unknown Game'}
                            </span>
                            <span className="item-quantity">
                              Quantity: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="item-price">
                          ${item.game?.price ? (item.game.price * item.quantity).toFixed(2) : '0.00'}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-items">No items in this order</p>
                )}
              </div>

              <div className="order-total">
                <span className="label">Total Amount:</span>
                <span className="amount">${order.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
