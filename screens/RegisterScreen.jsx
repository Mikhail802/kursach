import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { API_URL } from '../services/config';
import { Mail, Lock, User } from 'lucide-react-native';

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!isValidEmail(email)) newErrors.email = 'Некорректный email';
    if (!username.trim()) newErrors.username = 'Введите логин';
    if (!name.trim()) newErrors.name = 'Введите имя';
    if (!isStrongPassword(password)) newErrors.password = 'Минимум 8 символов, буква и цифра';
    if (password !== confirmPassword) newErrors.confirm = 'Пароли не совпадают';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(`${API_URL}/email/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, from: 'register' }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.navigate("VerifyEmail", { email, password, name, username, from: 'register' });
      } else {
        Alert.alert('Ошибка', data.error || 'Не удалось отправить код');
      }
    } catch (err) {
      Alert.alert('Ошибка сети', 'Попробуйте позже');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Mail size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <Text style={[styles.error, !errors.email && styles.errorPlaceholder]}>{errors.email || ' '}</Text>

      {/* Username */}
      <View style={styles.inputContainer}>
        <User size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Логин"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <Text style={[styles.error, !errors.username && styles.errorPlaceholder]}>{errors.username || ' '}</Text>

      {/* Name */}
      <View style={styles.inputContainer}>
        <User size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Имя"
          value={name}
          onChangeText={setName}
        />
      </View>
      <Text style={[styles.error, !errors.name && styles.errorPlaceholder]}>{errors.name || ' '}</Text>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Lock size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Text style={[styles.error, !errors.password && styles.errorPlaceholder]}>{errors.password || ' '}</Text>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <Lock size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Подтвердите пароль"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <Text style={[styles.error, !errors.confirm && styles.errorPlaceholder]}>{errors.confirm || ' '}</Text>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.textButton}>Уже есть аккаунт? Войти</Text>
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
  registerButton: {
    backgroundColor: '#4CAF50', borderRadius: 12,
    paddingVertical: 14, marginTop: 10, alignItems: 'center', elevation: 2,
  },
  registerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  textButton: { color: '#007bff', marginTop: 15, textAlign: 'center', fontSize: 14, fontWeight: '500' },
});

export default RegisterScreen;
