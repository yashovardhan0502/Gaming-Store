import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1 className="error-code">403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p className="description">
          This page requires admin privileges. Please contact your administrator
          if you believe you should have access.
        </p>
        <Link to="/games" className="back-button">
          Go Back to Games
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
