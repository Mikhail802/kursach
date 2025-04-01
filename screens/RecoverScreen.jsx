import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { API_URL } from '../services/config';

const RecoverScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleRecover = async () => {
    try {
      console.log("📤 Восстановление запрошено для:", email);

      const res = await fetch(`${API_URL}/email/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, from: 'recover' })
      });

      const data = await res.json();
      console.log("✅ Ответ от сервера:", data);

      if (res.ok) {
        navigation.navigate('VerifyEmail', {
          email,
          from: 'recover',
        });
      } else {
        alert(data.error || 'Ошибка при отправке кода');
      }
    } catch (error) {
      console.error('❌ Ошибка запроса:', error);
      alert('Ошибка соединения: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Восстановление пароля</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Сбросить пароль" onPress={handleRecover} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Назад ко входу</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%', padding: 12, borderWidth: 1, borderColor: '#ccc',
    marginBottom: 12, borderRadius: 8,
  },
  link: { color: '#007bff', marginTop: 15 },
});

export default RecoverScreen;
