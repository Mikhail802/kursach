
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../services/config';

const FriendRequestsScreen = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("👤 user из контекста:", user);

  const fetchRequests = async () => {
    try {
      console.log("📤 Запрос заявок");
      const res = await fetch(`${API_URL}/friends/requests?userId=${user.id}`);
      const data = await res.json();
      console.log("📥 Ответ:", data);
      setRequests(data);
    } catch (err) {
      console.error("❌ Ошибка:", err);
    } finally {
      setLoading(false); // Без этого будет вечная загрузка
    }
  };
  useEffect(() => {
    console.log("🚀 useEffect вызван, user.id:", user?.id);
    fetchRequests();
  }, []);
  
  const acceptRequest = async (fromId) => {
    try {
      const res = await fetch(`${API_URL}/friends/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: user.id, friendId: fromId }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Заявка принята');
        fetchRequests(); // обновить список
      } else {
        Alert.alert('Ошибка', data.error || 'Не удалось принять заявку');
      }
    } catch (err) {
      Alert.alert('Ошибка сети', 'Попробуйте позже');
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestItem}>
      <View>
        <Text style={styles.name}>{item.user?.name}</Text>
        <Text style={styles.username}>@{item.user?.username}</Text>
      </View>
      <TouchableOpacity onPress={() => acceptRequest(item.user?.id)} style={styles.acceptBtn}>
        <Text style={styles.acceptText}>Принять</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Заявки в друзья</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item, index) => item.id || item.user?.id || index.toString()}
          renderItem={renderRequest}
          ListEmptyComponent={<Text>Нет входящих заявок</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  requestItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#ccc',
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  username: { fontSize: 14, color: 'gray' },
  acceptBtn: {
    backgroundColor: '#28a745', paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 6,
  },
  acceptText: { color: '#fff', fontWeight: 'bold' },
});

export default FriendRequestsScreen;
