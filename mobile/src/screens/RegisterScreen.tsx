import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    gender: 'male',
    interestedIn: 'female',
  });
  const [loading, setLoading] = useState(false);
  
  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name || !formData.birthDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(v) => updateField('name', v)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(v) => updateField('email', v)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Birth Date (YYYY-MM-DD)"
        value={formData.birthDate}
        onChangeText={(v) => updateField('birthDate', v)}
      />
      
      <View style={styles.section}>
        <Text style={styles.label}>Gender:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, formData.gender === 'male' && styles.optionButtonActive]}
            onPress={() => updateField('gender', 'male')}
          >
            <Text style={[styles.optionText, formData.gender === 'male' && styles.optionTextActive]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, formData.gender === 'female' && styles.optionButtonActive]}
            onPress={() => updateField('gender', 'female')}
          >
            <Text style={[styles.optionText, formData.gender === 'female' && styles.optionTextActive]}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, formData.gender === 'other' && styles.optionButtonActive]}
            onPress={() => updateField('gender', 'other')}
          >
            <Text style={[styles.optionText, formData.gender === 'other' && styles.optionTextActive]}>Other</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Interested In:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, formData.interestedIn === 'male' && styles.optionButtonActive]}
            onPress={() => updateField('interestedIn', 'male')}
          >
            <Text style={[styles.optionText, formData.interestedIn === 'male' && styles.optionTextActive]}>Men</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, formData.interestedIn === 'female' && styles.optionButtonActive]}
            onPress={() => updateField('interestedIn', 'female')}
          >
            <Text style={[styles.optionText, formData.interestedIn === 'female' && styles.optionTextActive]}>Women</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, formData.interestedIn === 'both' && styles.optionButtonActive]}
            onPress={() => updateField('interestedIn', 'both')}
          >
            <Text style={[styles.optionText, formData.interestedIn === 'both' && styles.optionTextActive]}>Both</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(v) => updateField('password', v)}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(v) => updateField('confirmPassword', v)}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginVertical: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    fontSize: 16,
  },
});
