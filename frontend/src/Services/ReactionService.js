// src/services/reaction.js
import axios from 'axios';

const API_URL = 'http://localhost:3333/api';

export const reactToPost = async (postId, reactionType) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/react`, { reactionType });
  return response.data;
};

export const getPostReactions = async (postId) => {
  const response = await axios.get(`${API_URL}/posts/${postId}/reactions`);
  return response.data;
};