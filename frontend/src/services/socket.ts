import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, ((...args: any[]) => void)[]> = new Map();

  async connect() {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      console.log('No token found, cannot connect to socket');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    // Set up listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
      this.socket?.off(event, callback);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  sendMessage(receiverId: string, content: string) {
    this.emit('sendMessage', { receiverId, content });
  }

  sendTyping(recipientId: string, isTyping: boolean) {
    this.emit('typing', { recipientId, isTyping });
  }

  markMessageSeen(messageId: string) {
    this.emit('messageSeen', { messageId });
  }
}

export default new SocketService();
