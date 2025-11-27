import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { messageAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuth } from '../contexts/AuthContext';

const ChatScreen = ({ route, navigation }: any) => {
  const { userId, userName } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    navigation.setOptions({ title: userName });
    fetchMessages();
    markConversationAsSeen();

    // Listen for new messages and typing
    socketService.on('newMessage', handleNewMessage);
    socketService.on('typing', handleTyping);
    socketService.on('messageSeen', handleMessageSeen);

    return () => {
      socketService.off('newMessage', handleNewMessage);
      socketService.off('typing', handleTyping);
      socketService.off('messageSeen', handleMessageSeen);
    };
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getConversation(userId);
      setMessages(response.data);
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  };

  const markConversationAsSeen = async () => {
    try {
      await messageAPI.markConversationSeen(userId);
    } catch (error) {
      console.error('Mark conversation seen error:', error);
    }
  };

  const handleNewMessage = (message: any) => {
    if (
      (message.senderId === userId && message.receiverId === user?.id) ||
      (message.senderId === user?.id && message.receiverId === userId)
    ) {
      setMessages((prev) => [...prev, message]);
      
      // Mark as seen if from other user
      if (message.senderId === userId) {
        socketService.markMessageSeen(message.id);
      }
    }
  };

  const handleTyping = (data: any) => {
    if (data.userId === userId) {
      setIsTyping(data.isTyping);
    }
  };

  const handleMessageSeen = (data: any) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === data.messageId ? { ...msg, seen: true, seenAt: data.seenAt } : msg
      )
    );
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    socketService.sendMessage(userId, inputText.trim());
    setInputText('');
    socketService.sendTyping(userId, false);
  };

  const handleInputChange = (text: string) => {
    setInputText(text);

    // Send typing indicator
    socketService.sendTyping(userId, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendTyping(userId, false);
    }, 2000);
  };

  const renderMessage = ({ item }: any) => {
    const isMyMessage = item.senderId === user?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {item.content}
          </Text>
        </View>
        {isMyMessage && item.seen && (
          <Ionicons name="checkmark-done" size={16} color="#FF6B6B" style={styles.seenIcon} />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>{userName} is typing...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleInputChange}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#FF6B6B',
    borderBottomRightRadius: 5,
  },
  theirMessageBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#333',
  },
  seenIcon: {
    marginLeft: 5,
  },
  typingContainer: {
    padding: 10,
    paddingLeft: 15,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;
