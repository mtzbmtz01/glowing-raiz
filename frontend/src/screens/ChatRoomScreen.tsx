import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { Message } from '../types';
import { chatAPI } from '../services/api';
import socketService from '../services/socket';

export default function ChatRoomScreen({ route, navigation }: any) {
  const { userId, user: otherUser } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();

    // Set up socket listeners
    socketService.onNewMessage((message) => {
      if (message.senderId === userId || message.receiverId === userId) {
        setMessages(prev => [...prev, message]);
      }
    });

    socketService.onUserTyping((data) => {
      if (data.senderId === userId) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [userId]);

  const loadMessages = async () => {
    try {
      const data = await chatAPI.getMessages(userId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    socketService.sendMessage(userId, inputText);
    setInputText('');
  };

  const handleTyping = (text: string) => {
    setInputText(text);
    socketService.sendTypingIndicator(userId, text.length > 0);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;

    return (
      <View style={[styles.messageContainer, isMyMessage && styles.myMessageContainer]}>
        <View style={[styles.messageBubble, isMyMessage && styles.myMessageBubble]}>
          <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {otherUser?.profile?.displayName || 'Chat'}
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>Typing...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleTyping}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 28,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
  },
  myMessageBubble: {
    backgroundColor: '#FF6B6B',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  myMessageText: {
    color: '#fff',
  },
  typingIndicator: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  typingText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
