import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  Modal, TextInput, Button, TouchableOpacity
} from 'react-native';
import { Bell, ChevronRight } from 'lucide-react-native';
import { getRooms, createRoom, deleteRoom } from '../services/ApiService';

const HomeScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomTheme, setRoomTheme] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    const result = await getRooms();
    console.log('Результат getRooms:', result);
    setRooms(result || []);

    
    setLoading(false);
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim() || !roomTheme.trim()) {
      alert('Заполните все поля');
      return;
    }

    const newRoom = await createRoom(roomName, roomTheme);
    if (newRoom) {
      fetchRooms();
      setRoomName('');
      setRoomTheme('');
      setModalVisible(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Room', {
        roomId: item.id,
        roomName: item.name
      })}
      style={styles.roomItem}
    >
      <View>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomTheme}>Тема: {item.theme || 'Без темы'}</Text>
      </View>
      <ChevronRight size={20} color="#000" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Главная</Text>
        <TouchableOpacity>
          <Bell size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createRoomButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Создать комнату</Text>
        <ChevronRight size={20} color="#000" style={styles.icon} />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : rooms.length === 0 ? (
        <Text style={styles.emptyMessage}>Комнат пока нет</Text>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.roomList}
        />
      )}

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Создать комнату</Text>
            <TextInput
              style={styles.input}
              placeholder="Название комнаты"
              value={roomName}
              onChangeText={setRoomName}
            />
            <TextInput
              style={styles.input}
              placeholder="Тема комнаты"
              value={roomTheme}
              onChangeText={setRoomTheme}
            />
            <View style={styles.modalButtons}>
              <Button title="Отмена" onPress={() => setModalVisible(false)} />
              <Button title="Создать" onPress={handleCreateRoom} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createRoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECF6ED',
    paddingVertical: 15,
    paddingHorizontal: 20,
    height: 75,
    borderRadius: 15,
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roomList: {
    marginTop: 20,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  roomName: {
    fontSize: 16,
    color: '#000',
  },
  roomTheme: {
    fontSize: 14,
    color: '#666',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    color: '#aaa',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default HomeScreen;
