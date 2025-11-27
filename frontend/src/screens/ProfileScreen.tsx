import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../services/api';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getMyProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout, style: 'destructive' },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        {profile?.photos?.[0] ? (
          <Image source={{ uri: profile.photos[0] }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.placeholderImage]}>
            <Ionicons name="person" size={80} color="#ccc" />
          </View>
        )}

        <Text style={styles.name}>
          {profile?.name}, {profile?.age}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>

        {profile?.bio && (
          <View style={styles.bioContainer}>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="transgender-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{profile?.gender}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="heart-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{profile?.orientation}</Text>
        </View>

        {profile?.interests && profile.interests.length > 0 && (
          <View style={styles.interestsContainer}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interests}>
              {profile.interests.map((interest: string, index: number) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Looking for:</Text>
          <Text style={styles.preferenceValue}>
            {profile?.preferredGender?.join(', ')}
          </Text>
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Age range:</Text>
          <Text style={styles.preferenceValue}>
            {profile?.preferredMinAge} - {profile?.preferredMaxAge}
          </Text>
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceLabel}>Max distance:</Text>
          <Text style={styles.preferenceValue}>
            {profile?.preferredMaxDistance} km
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    padding: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  bioContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  bio: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  interestsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  interestText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  preferencesSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#666',
  },
  preferenceValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
