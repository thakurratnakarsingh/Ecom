import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

// DummyJSON login endpoint: https://dummyjson.com/docs/auth

type Props = NativeStackScreenProps<RootStackParamList, 'Login'> & {
  onLoginSuccess: () => void;
};

const LoginScreen: React.FC<Props> = ({ navigation , onLoginSuccess}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!username || !password) {
      Alert.alert('Validation Error', 'Username and password are required.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username : username?.trim(), 
          password : password?.trim() }),
      });
      const data = await res.json();
      console.log("data",data);
      if (res.ok && data.accessToken) {
        await AsyncStorage.setItem('token', data.accessToken);
        onLoginSuccess()
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.eyeIcon}
        >
          <Text style={{ fontSize: 20 }}>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;