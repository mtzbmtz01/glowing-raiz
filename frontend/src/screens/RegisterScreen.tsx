import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { Gender, Orientation } from '../types';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('OTHER');
  const [orientation, setOrientation] = useState<Orientation>('OTHER');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !displayName || !age) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18) {
      Alert.alert('Error', 'You must be at least 18 years old');
      return;
    }

    setLoading(true);
    try {
      await register({
        email,
        password,
        displayName,
        age: ageNum,
        gender,
        orientation,
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Display Name *"
          value={displayName}
          onChangeText={setDisplayName}
        />

        <TextInput
          style={styles.input}
          placeholder="Age *"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.optionsRow}>
          {['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.option, gender === g && styles.optionSelected]}
              onPress={() => setGender(g as Gender)}
            >
              <Text style={[styles.optionText, gender === g && styles.optionTextSelected]}>
                {g.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Orientation</Text>
        <View style={styles.optionsRow}>
          {['STRAIGHT', 'GAY', 'LESBIAN', 'BISEXUAL', 'OTHER'].map((o) => (
            <TouchableOpacity
              key={o}
              style={[styles.option, orientation === o && styles.optionSelected]}
              onPress={() => setOrientation(o as Orientation)}
            >
              <Text style={[styles.optionText, orientation === o && styles.optionTextSelected]}>
                {o}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkTextBold}>Login</Text>
          </Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  option: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    color: '#666',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  linkTextBold: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});
