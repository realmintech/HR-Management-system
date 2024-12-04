// src/utils/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_LIVE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to retrieve user data from sessionStorage or localStorage
const getUserData = () => {
  const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear both storages if parsing fails
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
    }
  }
  return null;
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const user = getUserData();
    if (user && user.token) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - possibly invalid token');
      // Clear both storages if the token is invalid
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;