import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Any initial setup can go here
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // You could validate the token here
      setIsReady(true);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsReady(true);
    }
  };
  
  if (!isReady) {
    return null;
  }
  
  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
