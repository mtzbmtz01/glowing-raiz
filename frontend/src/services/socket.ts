import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  async connect() {
    const token = await SecureStore.getItemAsync('authToken');

    if (!token) {
      console.error('No auth token found');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
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
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(receiverId: string, content: string) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('send_message', { receiverId, content });
  }

  onMessageSent(callback: (message: any) => void) {
    if (!this.socket) return;
    this.socket.on('message_sent', callback);
  }

  onNewMessage(callback: (message: any) => void) {
    if (!this.socket) return;
    this.socket.on('new_message', callback);
  }

  sendTypingIndicator(receiverId: string, isTyping: boolean) {
    if (!this.socket) return;
    this.socket.emit('typing', { receiverId, isTyping });
  }

  onUserTyping(callback: (data: { senderId: string; isTyping: boolean }) => void) {
    if (!this.socket) return;
    this.socket.on('user_typing', callback);
  }

  markMessageRead(messageId: string) {
    if (!this.socket) return;
    this.socket.emit('mark_read', { messageId });
  }

  onMessageRead(callback: (message: any) => void) {
    if (!this.socket) return;
    this.socket.on('message_read', callback);
  }

  removeAllListeners() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }
}

export default new SocketService();
