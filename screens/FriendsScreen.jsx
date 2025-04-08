import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../services/config';
import { ChevronLeft } from 'lucide-react-native';

const FriendsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
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
    fetchFriends();
  }, []);

  const renderFriend = ({ item }) => (
    <View style={styles.friendItem}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.username}>@{item.Username}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Мои друзья</Text>
      </View>

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
          <Text style={styles.buttonText}>Добавить друга</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FriendRequests')}>
          <Text style={styles.buttonText}>Заявки в друзья</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  friendItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  username: { fontSize: 14, color: 'gray' },
  actions: { marginTop: 20 },
  button: {
    backgroundColor: '#4CAF50',  // Более яркий зелёный цвет
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',  // Добавим тень
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FriendsScreen;
