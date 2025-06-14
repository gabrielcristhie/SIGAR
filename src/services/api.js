import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  getRiskAreas: () => api.get('/risk-areas'),
  getRiskArea: (id) => api.get(`/risk-areas/${id}`),
  createRiskArea: (data) => api.post('/risk-areas', data),
  updateRiskArea: (id, data) => api.put(`/risk-areas/${id}`, data),
  deleteRiskArea: (id) => api.delete(`/risk-areas/${id}`),

  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),

  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),

  getAlerts: () => api.get('/monitoring/alerts'),
  getWeatherData: () => api.get('/monitoring/weather'),
};

export default api;
