import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthResponse } from '../types';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('authToken');
      const storedUser = await SecureStore.getItemAsync('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Connect socket
        await socketService.connect();
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authAPI.login({ email, password });
      
      await SecureStore.setItemAsync('authToken', response.token);
      await SecureStore.setItemAsync('authUser', JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);
      
      // Connect socket
      await socketService.connect();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response: AuthResponse = await authAPI.register(data);
      
      await SecureStore.setItemAsync('authToken', response.token);
      await SecureStore.setItemAsync('authUser', JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);
      
      // Connect socket
      await socketService.connect();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('authUser');
      
      setToken(null);
      setUser(null);
      
      // Disconnect socket
      socketService.disconnect();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    SecureStore.setItemAsync('authUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
