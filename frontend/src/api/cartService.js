import apiClient from "./apiClient.js";

export const addToCart = async (gameId) => {
  return await apiClient.post("/cart", { gameId });
};

export const getCart = async () => {
  const res = await apiClient.get("/cart");
  return res.data;
};

export const removeFromCart = async (gameId) => {
  return await apiClient.delete(`/cart/${gameId}`);
};

export const updateQuantity = async (gameId, quantity) => {
  return await apiClient.put(`/cart/${gameId}`, { quantity });
};

export const checkOut = async (paymentData) => {
  return await apiClient.post("/cart/checkout", paymentData);
};
export const createStripeSession = async () => {
  const res = await apiClient.post("/cart/stripe-session");
  return res.data;
};
export const confirmPayment = async (sessionId) => {
  const res = await apiClient.post("/cart/confirm-payment", { sessionId });
  return res.data;
};
