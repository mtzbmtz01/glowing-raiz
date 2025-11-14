import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configure based on your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('authToken');
      // Optionally navigate to login
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth endpoints
export const authAPI = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  appleAuth: async (data: any) => {
    const response = await api.post('/auth/apple', data);
    return response.data;
  },
  googleAuth: async (data: any) => {
    const response = await api.post('/auth/google', data);
    return response.data;
  },
};

// Profile endpoints
export const profileAPI = {
  getMyProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },
  getProfile: async (userId: string) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/profile', data);
    return response.data;
  },
  updateLocation: async (latitude: number, longitude: number) => {
    const response = await api.put('/profile/location', { latitude, longitude });
    return response.data;
  },
  uploadPhoto: async (data: any) => {
    const response = await api.post('/profile/photos', data);
    return response.data;
  },
  deletePhoto: async (photoId: string) => {
    const response = await api.delete(`/profile/photos/${photoId}`);
    return response.data;
  },
};

// Match endpoints
export const matchAPI = {
  getNearbyUsers: async (params?: any) => {
    const response = await api.get('/match/nearby', { params });
    return response.data;
  },
  createMatch: async (userId: string) => {
    const response = await api.post('/match', { userId });
    return response.data;
  },
  getMatches: async () => {
    const response = await api.get('/match');
    return response.data;
  },
  blockUser: async (userId: string) => {
    const response = await api.post('/match/block', { userId });
    return response.data;
  },
  reportUser: async (userId: string, reason: string) => {
    const response = await api.post('/match/report', { userId, reason });
    return response.data;
  },
};

// Chat endpoints
export const chatAPI = {
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },
  getMessages: async (userId: string, params?: any) => {
    const response = await api.get(`/chat/${userId}`, { params });
    return response.data;
  },
  sendMessage: async (receiverId: string, content: string) => {
    const response = await api.post('/chat', { receiverId, content });
    return response.data;
  },
};
