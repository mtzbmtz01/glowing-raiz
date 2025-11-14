import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const profileAPI = {
  updateProfile: async (data: any) => {
    const response = await api.put('/profiles/me', data);
    return response.data;
  },
  
  getProfile: async (userId: string) => {
    const response = await api.get(`/profiles/${userId}`);
    return response.data;
  },
  
  getNearbyUsers: async (filters?: any) => {
    const response = await api.get('/profiles/nearby', { params: filters });
    return response.data;
  },
};

export const messageAPI = {
  sendMessage: async (receiverId: string, content: string) => {
    const response = await api.post('/messages', { receiverId, content });
    return response.data;
  },
  
  getConversation: async (otherUserId: string) => {
    const response = await api.get(`/messages/${otherUserId}`);
    return response.data;
  },
  
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },
  
  markAsRead: async (messageId: string) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },
};

export const blockAPI = {
  blockUser: async (blockedId: string) => {
    const response = await api.post('/blocks', { blockedId });
    return response.data;
  },
  
  unblockUser: async (blockedId: string) => {
    const response = await api.delete(`/blocks/${blockedId}`);
    return response.data;
  },
  
  getBlockedUsers: async () => {
    const response = await api.get('/blocks');
    return response.data;
  },
};

export const reportAPI = {
  createReport: async (reportedId: string, reason: string, details?: string) => {
    const response = await api.post('/reports', { reportedId, reason, details });
    return response.data;
  },
  
  getReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },
};

export default api;
