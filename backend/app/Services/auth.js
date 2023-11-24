// src/services/auth.js

import axios from 'axios';

const API_URL = 'http://localhost:3333/api';

export const signup = (userData) => axios.post(`${API_URL}/auth/signup`, userData);
export const login = (userData) => axios.post(`${API_URL}/auth/login`, userData);
export const logout = () => axios.post(`${API_URL}/auth/logout`);
export const sendPasswordResetEmail = (email) => axios.post(`${API_URL}/auth/password-reset`, { email });
export const resetPassword = (resetData) => axios.post(`${API_URL}/auth/reset-password`, resetData);
