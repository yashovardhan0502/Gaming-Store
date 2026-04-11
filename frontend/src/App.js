import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import GameList from './components/GameList';
import MyOrders from './components/MyOrders';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Unauthorized from './components/Unauthorized';
import Cart from './components/Cart';
import Success from './components/Success';
import Cancel from './components/Cancel';
import { NotificationProvider } from './components/NotificationContext';

// import './App.css';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="App">
          <div className="mesh-bg"></div>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/games" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path='/cart' element={<Cart />} />
            <Route
              path='/success'
              element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              }
            />
            <Route
              path='/cancel'
              element={
                <ProtectedRoute>
                  <Cancel />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes (User) */}
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes (Admin Only) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to games */}
            <Route path="*" element={<Navigate to="/games" replace />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
