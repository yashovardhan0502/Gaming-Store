import React from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'info': return 'ℹ️';
            case 'warning': return '⚠️';
            default: return '🔔';
        }
    };

    return (
        <div className={`notification ${type}`} onClick={onClose}>
            <span className="notification-icon">{getIcon()}</span>
            <span className="notification-message">{message}</span>
            <button className="notification-close">×</button>
        </div>
    );
};

export default Notification;
