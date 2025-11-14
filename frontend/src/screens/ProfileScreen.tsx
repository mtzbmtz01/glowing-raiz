import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { User } from '../types';
import { profileAPI, matchAPI } from '../services/api';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ route, navigation }: any) {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await profileAPI.getProfile(userId);
      setUser(response);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    navigation.navigate('ChatRoom', { userId, user });
  };

  const handleBlock = async () => {
    Alert.alert(
      'Block User',
      'Are you sure you want to block this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              await matchAPI.blockUser(userId);
              Alert.alert('Success', 'User blocked');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to block user');
            }
          },
        },
      ]
    );
  };

  const handleReport = () => {
    Alert.prompt(
      'Report User',
      'Please provide a reason for reporting this user',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          onPress: async (reason) => {
            if (reason) {
              try {
                await matchAPI.reportUser(userId, reason);
                Alert.alert('Success', 'User reported');
              } catch (error) {
                Alert.alert('Error', 'Failed to report user');
              }
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!user || !user.profile) {
    return (
      <View style={styles.centerContainer}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  const photos = user.profile.photos || [];
  const currentPhoto = photos[currentPhotoIndex];

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Photo carousel */}
        <View style={styles.photoContainer}>
          {currentPhoto ? (
            <Image source={{ uri: currentPhoto.url }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.noPhoto]}>
              <Text style={styles.noPhotoText}>No Photo</Text>
            </View>
          )}
          
          {photos.length > 1 && (
            <View style={styles.photoDots}>
              {photos.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, currentPhotoIndex === index && styles.dotActive]}
                />
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Profile info */}
        <View style={styles.info}>
          <Text style={styles.name}>
            {user.profile.displayName}, {user.profile.age}
          </Text>
          
          {user.distance !== undefined && (
            <Text style={styles.distance}>{user.distance.toFixed(1)} miles away</Text>
          )}

          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{user.profile.gender}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{user.profile.orientation}</Text>
            </View>
          </View>

          {user.profile.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{user.profile.bio}</Text>
            </View>
          )}

          {user.profile.interests && user.profile.interests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.interests}>
                {user.profile.interests.map((interest, index) => (
                  <View key={index} style={styles.interest}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleBlock}>
          <Text style={styles.actionButtonText}>🚫 Block</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={handleMessage}>
          <Text style={[styles.actionButtonText, styles.messageButtonText]}>
            💬 Message
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleReport}>
          <Text style={styles.actionButtonText}>⚠️ Report</Text>
        </TouchableOpacity>
      </View>
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
  photoContainer: {
    width: width,
    height: width * 1.2,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  noPhoto: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotoText: {
    color: '#999',
    fontSize: 18,
  },
  photoDots: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  info: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  distance: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  tags: {
    flexDirection: 'row',
    marginTop: 15,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  tagText: {
    color: '#666',
    fontSize: 14,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interest: {
    backgroundColor: '#FFE5E5',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  interestText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  messageButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666',
  },
  messageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
