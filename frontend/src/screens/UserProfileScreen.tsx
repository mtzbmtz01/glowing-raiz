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
import { profileAPI, safetyAPI } from '../services/api';

const UserProfileScreen = ({ route, navigation }: any) => {
  const { userId } = route.params;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await profileAPI.getUserProfile(userId);
      setUser(response.data);
    } catch (error: any) {
      console.error('Fetch user error:', error);
      Alert.alert('Error', 'Failed to load user profile');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    navigation.navigate('Chat', {
      userId: user.id,
      userName: user.profile?.name,
    });
  };

  const handleBlock = () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${user.profile?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              await safetyAPI.blockUser(userId);
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
    Alert.alert(
      'Report User',
      'Why are you reporting this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Inappropriate Content',
          onPress: () => submitReport('INAPPROPRIATE_CONTENT'),
        },
        { text: 'Harassment', onPress: () => submitReport('HARASSMENT') },
        { text: 'Spam', onPress: () => submitReport('SPAM') },
        { text: 'Fake Profile', onPress: () => submitReport('FAKE_PROFILE') },
        { text: 'Other', onPress: () => submitReport('OTHER') },
      ],
      { cancelable: true }
    );
  };

  const submitReport = async (reason: string) => {
    try {
      await safetyAPI.reportUser({ reportedId: userId, reason });
      Alert.alert('Success', 'User reported. We will review this report.');
    } catch (error) {
      Alert.alert('Error', 'Failed to report user');
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {user.profile?.photos?.[0] ? (
          <Image source={{ uri: user.profile.photos[0] }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="person" size={100} color="#ccc" />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {user.profile?.name}, {user.profile?.age}
        </Text>

        {user.profile?.bio && (
          <View style={styles.bioContainer}>
            <Text style={styles.bio}>{user.profile.bio}</Text>
          </View>
        )}

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="transgender-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{user.profile?.gender}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="heart-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{user.profile?.orientation}</Text>
          </View>
        </View>

        {user.profile?.interests && user.profile.interests.length > 0 && (
          <View style={styles.interestsContainer}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interests}>
              {user.profile.interests.map((interest: string, index: number) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.iconButton} onPress={handleBlock}>
              <Ionicons name="ban-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleReport}>
              <Ionicons name="flag-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 400,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bioContainer: {
    marginBottom: 20,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  interestsContainer: {
    marginBottom: 20,
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
  actionsContainer: {
    marginTop: 20,
  },
  messageButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconButton: {
    padding: 15,
    marginHorizontal: 10,
  },
});

export default UserProfileScreen;
