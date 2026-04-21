import axios from 'axios';
import { getStoredAuth } from "../utils/authStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur pour ajouter le token automatiquement si présent
api.interceptors.request.use(
  config => {
    const { token } = getStoredAuth();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
