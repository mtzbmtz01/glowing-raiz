import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await AsyncStorage.removeItem('token');
      // You can add navigation logic here
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Profile API
export const profileAPI = {
  getMyProfile: () => api.get('/profile/me'),
  updateProfile: (data: any) => api.put('/profile/me', data),
  updateLocation: (data: { latitude: number; longitude: number }) =>
    api.put('/profile/me/location', data),
  getUserProfile: (userId: string) => api.get(`/profile/${userId}`),
};

// Discovery API
export const discoveryAPI = {
  getNearbyUsers: () => api.get('/discovery/nearby'),
};

// Message API
export const messageAPI = {
  sendMessage: (data: { receiverId: string; content: string }) =>
    api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId: string, params?: any) =>
    api.get(`/messages/conversations/${userId}`, { params }),
  markMessageSeen: (messageId: string) =>
    api.put(`/messages/${messageId}/seen`),
  markConversationSeen: (userId: string) =>
    api.put(`/messages/conversations/${userId}/seen`),
};

// Safety API
export const safetyAPI = {
  blockUser: (userId: string) => api.post(`/safety/block/${userId}`),
  unblockUser: (userId: string) => api.delete(`/safety/block/${userId}`),
  getBlockedUsers: () => api.get('/safety/blocked'),
  reportUser: (data: any) => api.post('/safety/report', data),
};

// Admin API
export const adminAPI = {
  getAllUsers: (params?: any) => api.get('/admin/users', { params }),
  suspendUser: (userId: string) => api.put(`/admin/users/${userId}/suspend`),
  activateUser: (userId: string) => api.put(`/admin/users/${userId}/activate`),
  getAllReports: (params?: any) => api.get('/admin/reports', { params }),
  resolveReport: (reportId: string) =>
    api.put(`/admin/reports/${reportId}/resolve`),
  getStats: () => api.get('/admin/stats'),
};
