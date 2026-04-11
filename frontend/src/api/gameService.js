import apiClient from './apiClient';

const gameService = {
  getAllGames: async (params = {}) => {
    try {
      const response = await apiClient.get('/games', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch games' };
    }
  },

  getGameById: async (id) => {
    try {
      const response = await apiClient.get(`/games/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch game details' };
    }
  },

  addGame: async (gameData) => {
    try {
      const response = await apiClient.post('/games', gameData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add game' };
    }
  },

  updateGame: async (id, gameData) => {
    try {
      const response = await apiClient.put(`/games/${id}`, gameData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update game' };
    }
  },

  deleteGame: async (id) => {
    try {
      const response = await apiClient.delete(`/games/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete game' };
    }
  },
};

export default gameService;