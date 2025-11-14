import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  
  async connect() {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token');
    }
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });
    
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });
    
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    return this.socket;
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  sendMessage(receiverId: string, content: string) {
    if (this.socket) {
      this.socket.emit('send-message', { receiverId, content });
    }
  }
  
  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }
  
  onMessageSent(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('message-sent', callback);
    }
  }
  
  startTyping(receiverId: string) {
    if (this.socket) {
      this.socket.emit('typing', { receiverId });
    }
  }
  
  stopTyping(receiverId: string) {
    if (this.socket) {
      this.socket.emit('stop-typing', { receiverId });
    }
  }
  
  onUserTyping(callback: (data: { userId: string }) => void) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }
  
  onUserStopTyping(callback: (data: { userId: string }) => void) {
    if (this.socket) {
      this.socket.on('user-stop-typing', callback);
    }
  }
  
  onUserOnline(callback: (data: { userId: string }) => void) {
    if (this.socket) {
      this.socket.on('user-online', callback);
    }
  }
  
  onUserOffline(callback: (data: { userId: string }) => void) {
    if (this.socket) {
      this.socket.on('user-offline', callback);
    }
  }
}

export default new SocketService();
