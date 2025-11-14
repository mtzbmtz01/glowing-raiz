import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { User } from '../types';
import { matchAPI, profileAPI } from '../services/api';

export default function HomeGridScreen({ navigation }: any) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNearbyUsers();
  }, []);

  const loadNearbyUsers = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to find nearby users');
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      
      // Update user's location
      await profileAPI.updateLocation(
        location.coords.latitude,
        location.coords.longitude
      );

      // Get nearby users
      const response = await matchAPI.getNearbyUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading nearby users:', error);
      Alert.alert('Error', 'Failed to load nearby users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNearbyUsers();
  };

  const renderUserCard = ({ item }: { item: User }) => {
    const profilePhoto = item.profile?.photos?.find(p => p.isProfile) || item.profile?.photos?.[0];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Profile', { userId: item.id })}
      >
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto.url }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.noImage]}>
            <Text style={styles.noImageText}>No Photo</Text>
          </View>
        )}
        
        <View style={styles.cardOverlay}>
          <Text style={styles.cardName}>{item.profile?.displayName || 'Unknown'}</Text>
          <Text style={styles.cardInfo}>
            {item.profile?.age} • {item.distance?.toFixed(1)} mi away
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
        <Text style={styles.headerTitle}>Nearby</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.headerButton}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {users.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No users nearby</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search radius</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerButton: {
    fontSize: 24,
  },
  grid: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    aspectRatio: 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardInfo: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
