import React, { useState, useContext } from 'react';
import {
  View, TextInput, StyleSheet, Text, TouchableOpacity, Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react-native';

const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!identifier.trim()) newErrors.identifier = 'Введите логин или email';
    if (!isStrongPassword(password))
      newErrors.password = 'Минимум 8 символов, буква и цифра';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const success = await login(identifier.trim(), password);
    if (!success) {
      Alert.alert('Ошибка входа', 'Проверьте логин/email и пароль');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>

      <View style={styles.inputContainer}>
        <Mail size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email или логин"
          autoCapitalize="none"
          value={identifier}
          onChangeText={setIdentifier}
        />
      </View>
      <Text style={[styles.error, !errors.identifier && styles.errorPlaceholder]}>
        {errors.identifier || ' '}
      </Text>

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
      <Text style={[styles.error, !errors.password && styles.errorPlaceholder]}>
        {errors.password || ' '}
      </Text>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Войти</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.textButton}>Нет аккаунта? Зарегистрируйтесь</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
        <Text style={styles.textButton}>Забыли пароль?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 12, marginBottom: 5,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: '#333' },
  error: { minHeight: 18, fontSize: 13, color: '#ff4d4f', marginBottom: 10 },
  errorPlaceholder: { color: 'transparent' },
  loginButton: {
    backgroundColor: '#4CAF50', borderRadius: 12,
    paddingVertical: 14, marginTop: 10, alignItems: 'center', elevation: 2,
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  textButton: { color: '#007bff', marginTop: 15, textAlign: 'center', fontSize: 14, fontWeight: '500' },
});

export default LoginScreen;
