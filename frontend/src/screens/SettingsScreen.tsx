import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }: any) => {
  const settingsOptions = [
    {
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => {
        // Navigate to edit profile screen (to be implemented)
      },
    },
    {
      title: 'Preferences',
      icon: 'options-outline',
      onPress: () => {
        // Navigate to preferences screen (to be implemented)
      },
    },
    {
      title: 'Privacy & Safety',
      icon: 'shield-outline',
      onPress: () => {
        // Navigate to privacy screen (to be implemented)
      },
    },
    {
      title: 'Blocked Users',
      icon: 'ban-outline',
      onPress: () => {
        // Navigate to blocked users screen (to be implemented)
      },
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => {
        // Navigate to notifications settings (to be implemented)
      },
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => {
        // Navigate to help screen (to be implemented)
      },
    },
    {
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => {
        // Navigate to about screen (to be implemented)
      },
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={option.onPress}
          >
            <View style={styles.optionLeft}>
              <Ionicons name={option.icon as any} size={24} color="#333" />
              <Text style={styles.optionText}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Raiz v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: '#999',
  },
});

export default SettingsScreen;
