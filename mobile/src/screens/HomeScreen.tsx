import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { profileAPI } from '../services/api';
import { NearbyUser } from '../types';
import { requestLocationPermission, getCurrentLocation } from '../utils/location';

export default function HomeScreen({ navigation }: any) {
  const [users, setUsers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    setLoading(true);
    try {
      // Request location permission
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required');
        setLoading(false);
        return;
      }
      
      // Get current location
      const location = await getCurrentLocation();
      if (location) {
        // Update user's location
        await profileAPI.updateProfile({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
      
      // Fetch nearby users
      const data = await profileAPI.getNearbyUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load nearby users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };
  
  const renderUser = ({ item }: { item: NearbyUser }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
    >
      <View style={styles.userImageContainer}>
        {item.profile?.photos?.[0] ? (
          <Image
            source={{ uri: item.profile.photos[0] }}
            style={styles.userImage}
          />
        ) : (
          <View style={[styles.userImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>
              {item.profile?.name?.[0] || '?'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.profile?.name}</Text>
        <Text style={styles.userDistance}>
          {Math.round(item.distance)} km away
        </Text>
        {item.profile?.bio && (
          <Text style={styles.userBio} numberOfLines={2}>
            {item.profile.bio}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby</Text>
      </View>
      
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No users nearby'}
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
  grid: {
    padding: 10,
  },
  userCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userImageContainer: {
    width: '100%',
    aspectRatio: 1,
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    padding: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userDistance: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userBio: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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
