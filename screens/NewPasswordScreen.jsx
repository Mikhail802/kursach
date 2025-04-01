
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../services/config';

const NewPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isStrongPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают.');
      return;
    }

    if (!isStrongPassword(newPassword)) {
      Alert.alert('Ошибка', 'Пароль должен быть не менее 8 символов, содержать буквы и цифры.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword }),
      });

      if (res.ok) {
        Alert.alert('Успех', 'Пароль успешно обновлён.');
        navigation.navigate('Login');
      } else {
        const data = await res.json();
        Alert.alert('Ошибка', data.error || 'Не удалось обновить пароль.');
      }
    } catch (err) {
      Alert.alert('Ошибка сети', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новый пароль для {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Новый пароль"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Подтвердите пароль"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Сменить пароль" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default NewPasswordScreen;
