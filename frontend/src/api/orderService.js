import apiClient from './apiClient';

/**
 * Order Service
 * Handles all order-related API calls
 */

const orderService = {
  /**
   * Place a new order (Protected - User)
   * @param {Object} orderData - Order data
   * @param {Array} orderData.items - Array of order items
   * @param {string} orderData.items[].game - Game ID
   * @param {number} orderData.items[].quantity - Quantity
   * @param {number} orderData.totalAmount - Total order amount
   * @returns {Promise<Object>} Created order
   */
  placeOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to place order' };
    }
  },

  /**
   * Get user's own orders (Protected - User)
   * @returns {Promise<Array>} Array of user's orders
   */
  getMyOrders: async () => {
    try {
      const response = await apiClient.get('/orders/my');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your orders' };
    }
  },

  /**
   * Get all orders (Protected - Admin Only)
   * @returns {Promise<Array>} Array of all orders
   */
  getAllOrders: async () => {
    try {
      const response = await apiClient.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all orders' };
    }
  },

  /**
   * Update order status (Protected - Admin Only)
   * @param {string} id - Order ID
   * @param {Object} statusData - Status update data
   * @param {string} statusData.status - New order status
   * @returns {Promise<Object>} Updated order
   */
  updateOrderStatus: async (id, statusData) => {
    try {
      const response = await apiClient.put(`/orders/${id}`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },
};

export default orderService;
