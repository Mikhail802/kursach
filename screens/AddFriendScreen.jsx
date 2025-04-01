
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../services/config';

const AddFriendScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState('');

  const sendFriendRequest = async () => {
    if (!username.trim()) {
      Alert.alert('Ошибка', 'Введите имя пользователя');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/friends/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: user.id, toUsername: username.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Успех', 'Заявка отправлена');
        setUsername('');
        navigation.goBack();
      } else {
        Alert.alert('Ошибка', data.error || 'Не удалось отправить заявку');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      Alert.alert('Ошибка сети', 'Попробуйте позже');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Имя пользователя друга</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Добавить в друзья" onPress={sendFriendRequest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    borderRadius: 6, marginBottom: 16, fontSize: 16,
  },
});

export default AddFriendScreen;
