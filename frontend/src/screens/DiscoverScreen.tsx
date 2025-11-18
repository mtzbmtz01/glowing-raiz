import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { discoveryAPI, profileAPI } from '../services/api';

const DiscoverScreen = ({ navigation }: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    requestLocationAndFetchUsers();
  }, []);

  const requestLocationAndFetchUsers = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to discover nearby users'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      await profileAPI.updateLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      await fetchNearbyUsers();
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const fetchNearbyUsers = async () => {
    setLoading(true);
    try {
      const response = await discoveryAPI.getNearbyUsers();
      setUsers(response.data);
    } catch (error: any) {
      console.error('Fetch users error:', error);
      if (error.response?.status !== 400) {
        Alert.alert('Error', 'Failed to fetch nearby users');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await requestLocationAndFetchUsers();
    setRefreshing(false);
  };

  const renderUser = ({ item }: any) => (
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
            <Ionicons name="person" size={40} color="#ccc" />
          </View>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.profile?.name}, {item.profile?.age}
        </Text>
        <Text style={styles.userDistance}>
          {item.distance ? `${item.distance} km away` : 'Nearby'}
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
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {users.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No users nearby</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your preferences or refresh
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    padding: 10,
  },
  userCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userImageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    padding: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userDistance: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  userBio: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default DiscoverScreen;
