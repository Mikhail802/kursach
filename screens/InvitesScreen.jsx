import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../services/config';

const InvitesScreen = () => {
  const { user } = useContext(AuthContext);
  const [invites, setInvites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    console.log("user.id = ", user.id);
    try {
      const res = await fetch(`${API_URL}/rooms/invites?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      setInvites(data.invites || []);
    } catch (err) {
      console.error('Ошибка получения приглашений:', err);
    }
  };

  const handleAccept = async (inviteId) => {
    try {
      const res = await fetch(`${API_URL}/rooms/invite/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ inviteId }),
      });

      if (res.ok) {
        Alert.alert('Принято', 'Вы присоединились к комнате');
        fetchInvites();
      } else {
        const error = await res.json();
        Alert.alert('Ошибка', error.error || 'Не удалось принять приглашение');
      }
    } catch (err) {
      console.error('Ошибка при принятии приглашения:', err);
    }
  };

  const handleReject = async (inviteId) => {
    try {
      const res = await fetch(`${API_URL}/rooms/invite/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ inviteId }),
      });

      if (res.ok) {
        Alert.alert('Отклонено', 'Приглашение отклонено');
        fetchInvites();
      } else {
        const error = await res.json();
        Alert.alert('Ошибка', error.error || 'Не удалось отклонить приглашение');
      }
    } catch (err) {
      console.error('Ошибка при отклонении приглашения:', err);
    }
  };

  const renderInvite = ({ item }) => (
    <View style={styles.inviteCard}>
      <Text style={styles.roomTitle}>Комната: {item.roomName}</Text>
      <Text style={styles.inviter}>Отправитель: {item.inviterName}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
          <Text style={styles.acceptText}>Принять</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
          <Text style={styles.rejectText}>Отклонить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Приглашения</Text>

      <FlatList
        data={invites}
        keyExtractor={(item) => item.id}
        renderItem={renderInvite}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchInvites} />
        }
        ListEmptyComponent={<Text style={styles.emptyText}>Нет новых приглашений</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inviteCard: {
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  roomTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  inviter: { fontSize: 16, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  acceptText: { color: '#fff', fontWeight: 'bold' },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  rejectText: { color: '#fff', fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
});

export default InvitesScreen;
