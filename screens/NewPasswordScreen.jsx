import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { API_URL } from '../services/config';
import { Lock, ArrowLeft } from 'lucide-react-native';

const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const NewPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!isStrongPassword(newPassword)) {
      newErrors.password = 'Минимум 8 символов, буква и цифра';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirm = 'Пароли не совпадают';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(`${API_URL}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword }),
      });

      if (res.ok) {
        Alert.alert('Успех', 'Пароль успешно обновлён');
        navigation.navigate('Login');
      } else {
        const data = await res.json();
        Alert.alert('Ошибка', data.error || 'Не удалось обновить пароль');
      }
    } catch (err) {
      Alert.alert('Ошибка сети', err.message);
    }
  };

  const renderInput = (placeholder, value, onChange, secure, icon) => (
    <View style={styles.inputContainer}>
      {icon}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secure}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Новый пароль для</Text>
      <Text style={styles.emailText}>{email}</Text>

      {renderInput('Новый пароль', newPassword, setNewPassword, true, <Lock size={18} color="#888" style={styles.icon} />)}
      <Text style={[styles.error, !errors.password && styles.errorPlaceholder]}>
        {errors.password || ' '}
      </Text>

      {renderInput('Подтвердите пароль', confirmPassword, setConfirmPassword, true, <Lock size={18} color="#888" style={styles.icon} />)}
      <Text style={[styles.error, !errors.confirm && styles.errorPlaceholder]}>
        {errors.confirm || ' '}
      </Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleResetPassword}>
        <Text style={styles.saveButtonText}>Сменить пароль</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', justifyContent: 'center', padding: 20 },
  backButton: { position: 'absolute', top: 50, left: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  emailText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 12, marginBottom: 5,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: '#333' },
  error: { minHeight: 18, fontSize: 13, color: '#ff4d4f', marginBottom: 10 },
  errorPlaceholder: { color: 'transparent' },
  saveButton: {
    backgroundColor: '#4CAF50', borderRadius: 12,
    paddingVertical: 14, marginTop: 10, alignItems: 'center', elevation: 2,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default NewPasswordScreen;
