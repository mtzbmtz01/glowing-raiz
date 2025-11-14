import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { messageAPI } from '../services/api';
import { Conversation } from '../types';
import socketService from '../services/socket';

export default function ChatsScreen({ navigation }: any) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadConversations();
    
    // Connect to socket for real-time messages
    socketService.connect();
    
    socketService.onNewMessage((message) => {
      loadConversations();
    });
    
    return () => {
      socketService.disconnect();
    };
  }, []);
  
  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await messageAPI.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };
  
  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('Chat', { 
        userId: item.user.id,
        userName: item.user.profile?.name,
      })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.user.profile?.name?.[0] || '?'}
        </Text>
      </View>
      <View style={styles.conversationInfo}>
        <Text style={styles.userName}>{item.user.profile?.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage.content}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>
      
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.user.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No conversations yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
