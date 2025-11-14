import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { profileAPI } from '../services/api';

export default function SettingsScreen({ navigation }: any) {
  const { user, logout, updateUser } = useAuth();
  const [searchRadius, setSearchRadius] = useState(user?.profile?.searchRadius || 25);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const updateSearchRadius = async (value: number) => {
    try {
      const updatedProfile = await profileAPI.updateProfile({
        searchRadius: value,
      });
      setSearchRadius(value);
      updateUser({
        ...user!,
        profile: updatedProfile,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update search radius');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.itemText}>Edit Profile</Text>
          <Text style={styles.itemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.item}>
          <View>
            <Text style={styles.itemText}>Search Radius</Text>
            <Text style={styles.itemSubtext}>{searchRadius} miles</Text>
          </View>
        </View>
        
        <View style={styles.sliderContainer}>
          {[10, 25, 50, 100].map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.radiusOption,
                searchRadius === value && styles.radiusOptionSelected,
              ]}
              onPress={() => updateSearchRadius(value)}
            >
              <Text
                style={[
                  styles.radiusOptionText,
                  searchRadius === value && styles.radiusOptionTextSelected,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Privacy Policy</Text>
          <Text style={styles.itemArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Terms of Service</Text>
          <Text style={styles.itemArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.item, styles.logoutItem]} onPress={handleLogout}>
          <Text style={[styles.itemText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

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
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 28,
    color: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  itemSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  itemArrow: {
    fontSize: 24,
    color: '#ccc',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  radiusOption: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  radiusOptionSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  radiusOptionText: {
    fontSize: 14,
    color: '#666',
  },
  radiusOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3B30',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 40,
    marginBottom: 40,
  },
});
