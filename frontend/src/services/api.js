import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getAllSweets = async (queryParams) => {
    try {
        const url = queryParams
            ? `${API_URL}/sweets?${queryParams.toString()}`
            : `${API_URL}/sweets`;
            
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch sweets');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching sweets:', error);
        throw error;
    }
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfilePicture: (formData) => api.post('/users/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Authentication services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/user'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default api;