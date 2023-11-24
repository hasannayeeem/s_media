
// src/services/post.js
import axios from 'axios';

const API_URL = 'http://localhost:3333/api';

export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add other necessary post-related API calls as needed
