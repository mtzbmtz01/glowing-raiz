import React, { useEffect, useState, useRef } from 'react';
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
import { messageAPI } from '../services/api';
import { Message } from '../types';
import socketService from '../services/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen({ route, navigation }: any) {
  const { userId, userName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    navigation.setOptions({ title: userName });
    loadMessages();
    loadCurrentUser();
    
    // Socket listeners
    socketService.onNewMessage((message) => {
      if (message.senderId === userId) {
        setMessages((prev) => [...prev, message]);
      }
    });
    
    socketService.onMessageSent((message) => {
      if (message.receiverId === userId) {
        setMessages((prev) => [...prev, message]);
      }
    });
    
    socketService.onUserTyping((data) => {
      if (data.userId === userId) {
        setIsTyping(true);
      }
    });
    
    socketService.onUserStopTyping((data) => {
      if (data.userId === userId) {
        setIsTyping(false);
      }
    });
  }, []);
  
  const loadCurrentUser = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      setCurrentUserId(JSON.parse(user).id);
    }
  };
  
  const loadMessages = async () => {
    try {
      const data = await messageAPI.getConversation(userId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  
  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const messageText = inputText;
    setInputText('');
    
    socketService.sendMessage(userId, messageText);
    socketService.stopTyping(userId);
  };
  
  const handleTyping = (text: string) => {
    setInputText(text);
    
    if (text.length > 0) {
      socketService.startTyping(userId);
    } else {
      socketService.stopTyping(userId);
    }
  };
  
  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.senderId === currentUserId;
    
    return (
      <View
        style={[
          styles.messageContainer,
          isOwn ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>{userName} is typing...</Text>
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
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B6B',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    padding: 10,
    paddingLeft: 20,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
