import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    authService.logout();
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="navbar"
      >
        <div className="navbar-container">
          <Link to="/games" className="navbar-logo">
            <motion.div
              className="logo-icon"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            >
              ✧
            </motion.div>
            Game Store
          </Link>

          <div className="navbar-menu">
            <NavLink
              to="/games"
              className={({ isActive }) =>
                isActive ? "navbar-item active" : "navbar-item"
              }
            >
              Games
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    isActive ? "navbar-item active" : "navbar-item"
                  }
                >
                  Cart
                </NavLink>
                <NavLink
                  to="/my-orders"
                  className={({ isActive }) =>
                    isActive ? "navbar-item active" : "navbar-item"
                  }
                >
                  Orders
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      isActive ? "navbar-item admin-link active" : "navbar-item admin-link"
                    }
                  >
                    Admin
                  </NavLink>
                )}

                <div className="navbar-user">
                  <span className="user-name">
                    {currentUser?.name}
                  </span>

                  <button
                    onClick={handleLogoutClick}
                    className="logout-button"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "navbar-item active" : "navbar-item"
                  }
                >
                  Login
                </NavLink>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register" className="navbar-button">
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="logout-modal"
            >
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>

              <div className="modal-buttons">
                <button
                  onClick={confirmLogout}
                  className="confirm-button"
                >
                  Logout
                </button>

                <button
                  onClick={cancelLogout}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
