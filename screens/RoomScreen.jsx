import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Modal, Button, Alert
} from 'react-native';
import { ChevronLeft, Users } from 'lucide-react-native';
import {
  getColumns, createColumn, createTask,
  updateColumn, deleteColumn,
  updateTask, deleteTask
} from '../services/ApiService';
import { API_URL } from '../services/config';
import { AuthContext } from '../context/AuthContext';
import UserManagementModal from '../components/UserManagementModal';

const RoomScreen = ({ route, navigation }) => {
  const { roomId, roomName } = route.params;
  const { user } = useContext(AuthContext);

  const [columns, setColumns] = useState([]);
  const [room, setRoom] = useState({});
  const [role, setRole] = useState('member');
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [columnModalVisible, setColumnModalVisible] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [columnName, setColumnName] = useState('');
  const [editColumnModal, setEditColumnModal] = useState(false);
  const [columnToEdit, setColumnToEdit] = useState(null);
  const [editColumnTitle, setEditColumnTitle] = useState('');
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  useEffect(() => {
    const initialize = async () => {
      await fetchRoom();       // тут же установим роль
      await fetchColumns();
    };
    initialize();
  }, []);
  
  const fetchRoom = async () => {
    try {
      const res = await fetch(`${API_URL}/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      const roomData = data.data;
      setRoom(roomData);
  
      if (user.id === roomData.owner_id) {
        setRole('owner');
      } else {
        const found = roomData.members.find(m => m.user_id === user.id);
        setRole(found?.role || 'member');
      }
    } catch (err) {
      console.error('Ошибка получения комнаты:', err);
    }
  };
  

  const fetchUserRole = async () => {
    try {
      const res = await fetch(`${API_URL}/rooms/${roomId}/members`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      const member = data.members.find((m) => m.user_id === user.id);
  
      if (user.id === room.owner_id) {
        setRole('owner');
      } else {
        setRole(member?.role || 'member');
      }
    } catch (err) {
      console.error('Ошибка получения роли:', err);
      setRole('member'); // Подстраховка
    }
  };
  

  const fetchColumns = async () => {
    try {
      const data = await getColumns(roomId);
      setColumns(data);
    } catch (err) {
      console.error('Ошибка получения колонок:', err);
    }
  };

  const handleAddColumn = async () => {
    if (!columnName.trim()) return;
    await createColumn(roomId, columnName);
    setColumnName('');
    setColumnModalVisible(false);
    fetchColumns();
  };

  const handleAddTask = async () => {
    if (!taskText.trim() || !selectedColumnId) return;
    await createTask(selectedColumnId, taskText);
    setTaskText('');
    setModalVisible(false);
    fetchColumns();
  };

  const handleEditColumn = (column) => {
    setColumnToEdit(column);
    setEditColumnTitle(column.title);
    setEditColumnModal(true);
  };

  const handleUpdateColumn = async () => {
    if (!editColumnTitle.trim()) return;
    await updateColumn(columnToEdit.id, editColumnTitle);
    setEditColumnModal(false);
    fetchColumns();
  };

  const handleDeleteColumn = async (columnId) => {
    Alert.alert('Удалить колонку?', '', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        onPress: async () => {
          await deleteColumn(columnId);
          fetchColumns();
        },
        style: 'destructive',
      },
    ]);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setEditTaskText(task.text);
    setEditTaskModal(true);
  };

  const handleUpdateTask = async () => {
    if (!editTaskText.trim()) return;
    await updateTask(taskToEdit.id, editTaskText);
    setEditTaskModal(false);
    fetchColumns();
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert('Удалить задачу?', '', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        onPress: async () => {
          await deleteTask(taskId);
          fetchColumns();
        },
        style: 'destructive',
      },
    ]);
  };

  const renderColumn = (column) => (
    <TouchableOpacity
      key={column.id}
      onLongPress={() => role !== 'member' && handleEditColumn(column)}
      activeOpacity={1}
    >
      <View style={styles.column}>
        <Text style={styles.columnTitle}>{column.title}</Text>
        {(column.tasks || []).map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskCard}
            onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            onLongPress={() => role !== 'member' && handleEditTask(task)}
          >
            <Text style={styles.taskText}>{task.text}</Text>
          </TouchableOpacity>
        ))}
        {role !== 'member' && (
          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={() => {
              setSelectedColumnId(column.id);
              setModalVisible(true);
            }}
          >
            <Text style={styles.addTaskText}>Добавить задачу</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{roomName}</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Users size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.columnsContainer}>
        {columns.map(renderColumn)}
        {role !== 'member' && (
          <TouchableOpacity style={styles.addColumnButton} onPress={() => setColumnModalVisible(true)}>
            <Text style={styles.addColumnText}>Добавить колонку</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Модалки */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить задачу</Text>
            <TextInput
              style={styles.input}
              placeholder="Текст задачи"
              value={taskText}
              onChangeText={setTaskText}
            />
            <View style={styles.modalButtons}>
              <Button title="Отмена" onPress={() => setModalVisible(false)} />
              <Button title="Добавить" onPress={handleAddTask} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={columnModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить колонку</Text>
            <TextInput
              style={styles.input}
              placeholder="Название колонки"
              value={columnName}
              onChangeText={setColumnName}
            />
            <View style={styles.modalButtons}>
              <Button title="Отмена" onPress={() => setColumnModalVisible(false)} />
              <Button title="Добавить" onPress={handleAddColumn} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={editColumnModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редактировать колонку</Text>
            <TextInput
              style={styles.input}
              value={editColumnTitle}
              onChangeText={setEditColumnTitle}
              placeholder="Новое название"
            />
            <View style={styles.modalButtons}>
              <Button title="Удалить" onPress={() => {
                setEditColumnModal(false);
                handleDeleteColumn(columnToEdit.id);
              }} />
              <Button title="Сохранить" onPress={handleUpdateColumn} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={editTaskModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редактировать задачу</Text>
            <TextInput
              style={styles.input}
              value={editTaskText}
              onChangeText={setEditTaskText}
              placeholder="Новый текст задачи"
            />
            <View style={styles.modalButtons}>
              <Button title="Удалить" onPress={() => {
                setEditTaskModal(false);
                handleDeleteTask(taskToEdit.id);
              }} />
              <Button title="Сохранить" onPress={handleUpdateTask} />
            </View>
          </View>
        </View>
      </Modal>

      <UserManagementModal
      visible={showModal}
      onClose={() => setShowModal(false)}
      roomId={roomId}
      room={room}
      user={user}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  columnsContainer: { flexDirection: 'row' },
  column: {
    width: 300,
    marginRight: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  columnTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  taskCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskText: { fontSize: 16 },
  addTaskButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ECF6ED',
    borderRadius: 5,
    alignItems: 'center',
  },
  addTaskText: { fontSize: 16, color: '#4CAF50' },
  addColumnButton: {
    width: 300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF6ED',
    borderRadius: 10,
  },
  addColumnText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
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

export default RoomScreen;
