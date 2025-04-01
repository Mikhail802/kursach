
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../services/config';

const FriendsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  console.log("👤 user из контекста:", user);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      console.log("📤 Отправляем запрос на /friends?userId=", user.id);
      const res = await fetch(`${API_URL}/friends?userId=${user.id}`);
      const data = await res.json();
      console.log("📥 Друзья получены:", data);
      setFriends(data);
    } catch (err) {
      console.error("❌ Ошибка загрузки друзей:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("🚀 useEffect вызван для загрузки друзей");
    fetchFriends();
  }, []);

  const renderFriend = ({ item }) => (
    <View style={styles.friendItem}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.username}>@{item.username}</Text>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои друзья</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
   data={friends}
   keyExtractor={(item, index) => item.id || index.toString()}
   renderItem={renderFriend}
   ListEmptyComponent={<Text>У вас пока нет друзей.</Text>}
  />

      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddFriend')}>
          <Text style={styles.buttonText}>➕ Добавить друга</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FriendRequests')}>
          <Text style={styles.buttonText}>📥 Заявки в друзья</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  friendItem: {
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc',
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  username: { fontSize: 14, color: 'gray' },
  actions: { marginTop: 20 },
  button: {
    backgroundColor: '#007bff', padding: 12, borderRadius: 8, marginVertical: 6,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default FriendsScreen;
