import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { profileAPI } from '../services/api';

export default function EditProfileScreen({ navigation }: any) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    if (user?.profile) {
      setDisplayName(user.profile.displayName || '');
      setBio(user.profile.bio || '');
      setAge(user.profile.age?.toString() || '');
      setInterests(user.profile.interests?.join(', ') || '');
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedProfile = await profileAPI.updateProfile({
        displayName,
        bio,
        age: parseInt(age),
        interests: interests.split(',').map(i => i.trim()).filter(i => i),
      });

      updateUser({
        ...user!,
        profile: updatedProfile,
      });

      Alert.alert('Success', 'Profile updated');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Profile</Text>

        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Interests (comma separated)</Text>
        <TextInput
          style={styles.input}
          value={interests}
          onChangeText={setInterests}
          placeholder="e.g. Music, Travel, Food"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
