import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, FlatList, TouchableOpacity,
  StyleSheet, Button, Alert, ActivityIndicator
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { API_URL } from '../services/config';

const UserManagementModal = ({ visible, onClose, roomId, user }) => {
  const [members, setMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('member');
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    if (visible && roomId) {
      fetchRoom();
    }
  }, [visible]);

  useEffect(() => {
    if (inviteModalVisible) {
      fetchFriends();
    }
  }, [inviteModalVisible]);

  const fetchRoom = async () => {
    try {
      const res = await fetch(`${API_URL}/rooms/${roomId}`);
      const data = await res.json();
      const room = data.data;
      setMembers(room.members || []);
      setRole(user.id === room.owner_id ? 'owner' : getUserRole(room.members));
    } catch (err) {
      console.error('Ошибка загрузки данных комнаты:', err);
    }
  };

  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const res = await fetch(`${API_URL}/friends?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error('Ошибка загрузки списка друзей:', err);
    } finally {
      setLoadingFriends(false);
    }
  };

  const getUserRole = (members) => {
    const me = members.find(m => m.user.id === user.id);
    return me?.role || 'member';
  };

  const inviteFriend = async (toUsername) => {
    console.log("🔍 Приглашаем друга:", toUsername, "в комнату:", roomId);

    try {
      const res = await fetch(`${API_URL}/rooms/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          roomId,
          toUsername,
          role: 'member',
        }),
      });

      if (res.ok) {
        Alert.alert('Успех', 'Приглашение отправлено!');
        setInviteModalVisible(false);
      } else {
        const errorData = await res.json();
        Alert.alert('Ошибка', errorData.error || 'Не удалось отправить приглашение');
      }
    } catch (err) {
      console.error('Ошибка отправки приглашения:', err);
      Alert.alert('Ошибка сети', 'Попробуйте позже');
    }
  };

  const assignRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_URL}/rooms/assign-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ roomId, userId, role: newRole }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Успех', `Роль обновлена: ${newRole}`);
        fetchRoom();
      } else {
        Alert.alert('Ошибка', data.error || 'Не удалось обновить роль');
      }
    } catch (err) {
      console.error('Ошибка обновления роли:', err);
    }
  };

  const kickUser = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/rooms/${roomId}/members/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        Alert.alert('Пользователь удалён');
        fetchRoom();
      } else {
        const data = await res.json();
        Alert.alert('Ошибка', data.error || 'Не удалось удалить пользователя');
      }
    } catch (err) {
      console.error('Ошибка удаления пользователя:', err);
    }
  };

  const renderMember = ({ item }) => {
    const isSelf = item.user.id === user.id;
    const showActions = role === 'owner' && !isSelf && item.role !== 'owner';
  
    return (
      <View style={styles.memberItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.memberName}>
            {item.user.name} (@{item.user.Username})
          </Text>
          <Text style={styles.memberRole}>Роль: {item.role}</Text>
        </View>

        {showActions && (
          <TouchableOpacity onPress={() => setSelectedUser(item)} style={styles.menuButton}>
            <MoreVertical size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Участники комнаты</Text>
        <Text style={styles.subtitle}>Список участников:</Text>

        <FlatList
          data={members}
          keyExtractor={(item) => item.user.id}
          renderItem={renderMember}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => setInviteModalVisible(true)}
        >
          <Text style={styles.inviteText}>➕ Пригласить друга</Text>
        </TouchableOpacity>

        <Button title="Закрыть" onPress={onClose} />

        {selectedUser && (
          <View style={styles.modalOverlay}>
            <View style={styles.actionModal}>
              <Text style={styles.actionTitle}>Действия с пользователем</Text>
              <Button title="Сделать админом" onPress={() => {
                assignRole(selectedUser.user.id, 'admin');
                setSelectedUser(null);
              }} />
              <Button title="Сделать участником" onPress={() => {
                assignRole(selectedUser.user.id, 'member');
                setSelectedUser(null);
              }} />
              <Button title="Удалить" color="red" onPress={() => {
                kickUser(selectedUser.user.id);
                setSelectedUser(null);
              }} />
              <Button title="Отмена" onPress={() => setSelectedUser(null)} />
            </View>
          </View>
        )}

        <Modal visible={inviteModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.actionModal}>
              <Text style={styles.actionTitle}>Выберите друга</Text>
              {friends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={styles.memberItem}
                  onPress={() => inviteFriend(friend.Username)}
                >
                  <Text>{friend.name} (@{friend.Username})</Text>
                </TouchableOpacity>
              ))}
              <Button title="Отмена" onPress={() => setInviteModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { marginBottom: 10 },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  memberName: { fontSize: 16, fontWeight: 'bold' },
  memberRole: { fontSize: 14, color: '#666' },
  inviteButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
  },
  inviteText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  actionModal: {},
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default UserManagementModal;
