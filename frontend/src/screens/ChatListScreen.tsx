import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Conversation } from '../types';
import { chatAPI } from '../services/api';
import socketService from '../services/socket';

export default function ChatListScreen({ navigation }: any) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();

    // Listen for new messages
    socketService.onNewMessage((message) => {
      loadConversations();
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const loadConversations = async () => {
    try {
      const data = await chatAPI.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const profilePhoto = item.user.profile?.photos?.find(p => p.isProfile) || 
                         item.user.profile?.photos?.[0];

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigation.navigate('ChatRoom', { 
          userId: item.user.id,
          user: item.user 
        })}
      >
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto.url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.noAvatar]}>
            <Text style={styles.noAvatarText}>
              {item.user.profile?.displayName?.[0] || '?'}
            </Text>
          </View>
        )}

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName}>
              {item.user.profile?.displayName || 'Unknown'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.content}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.user.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  noAvatar: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
