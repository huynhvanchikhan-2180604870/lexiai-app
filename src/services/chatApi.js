import axiosClient from "./axiosClient";

// Creates a new chat conversation
export const createConversation = () => {
  return axiosClient.post("/chat");
};

// Gets all chat conversations for the authenticated user
export const getConversations = () => {
  return axiosClient.get("/chat");
};

// Gets a specific chat conversation by ID
export const getConversationById = (conversationId) => {
  return axiosClient.get(`/chat/${conversationId}`);
};

// Sends a message to a specific conversation and gets AI's response
export const sendMessage = (conversationId, message) => {
  return axiosClient.post(`/chat/${conversationId}/message`, { message });
};

// Deletes a specific chat conversation
export const deleteConversation = (conversationId) => {
  return axiosClient.delete(`/chat/${conversationId}`);
};
