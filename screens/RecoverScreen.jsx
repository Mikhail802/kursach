import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { API_URL } from '../services/config';
import { Mail } from 'lucide-react-native';

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const RecoverScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleRecover = async () => {
    if (!isValidEmail(email)) {
      setError('Введите корректный email');
      return;
    }
    setError('');

    try {
      const res = await fetch(`${API_URL}/email/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, from: 'recover' })
      });

      const data = await res.json();

      if (res.ok) {
        navigation.navigate('VerifyEmail', { email, from: 'recover' });
      } else {
        Alert.alert('Ошибка', data.error || 'Не удалось отправить код');
      }
    } catch (error) {
      Alert.alert('Ошибка сети', 'Попробуйте позже');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Восстановление пароля</Text>

      <View style={styles.inputContainer}>
        <Mail size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <Text style={[styles.error, !error && styles.errorPlaceholder]}>
        {error || ' '}
      </Text>

      <TouchableOpacity style={styles.recoverButton} onPress={handleRecover}>
        <Text style={styles.recoverButtonText}>Сбросить пароль</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.textButton}>Назад ко входу</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 25, textAlign: 'center', color: '#333' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 12, marginBottom: 5,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: '#333' },
  error: { minHeight: 18, fontSize: 13, color: '#ff4d4f', marginBottom: 10 },
  errorPlaceholder: { color: 'transparent' },
  recoverButton: {
    backgroundColor: '#4CAF50', borderRadius: 12,
    paddingVertical: 14, marginTop: 10, alignItems: 'center', elevation: 2,
  },
  recoverButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  textButton: { color: '#007bff', marginTop: 15, textAlign: 'center', fontSize: 14, fontWeight: '500' },
});

export default RecoverScreen;
