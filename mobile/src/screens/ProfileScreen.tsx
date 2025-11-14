import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import { User } from '../types';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    loadUser();
  }, []);
  
  const loadUser = async () => {
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            navigation.replace('Auth');
          },
        },
      ]
    );
  };
  
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.profile?.name?.[0] || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.profile?.name}</Text>
        {user?.profile?.birthDate && (
          <Text style={styles.age}>
            {calculateAge(user.profile.birthDate)} years old
          </Text>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>
          {user?.profile?.bio || 'No bio yet'}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{user?.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gender:</Text>
          <Text style={styles.detailValue}>{user?.profile?.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Interested In:</Text>
          <Text style={styles.detailValue}>{user?.profile?.interestedIn}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Max Distance:</Text>
          <Text style={styles.detailValue}>
            {user?.profile?.maxDistance} km
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile', { user })}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 48,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  age: {
    fontSize: 18,
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#FF6B6B',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
