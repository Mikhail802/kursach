import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { X, Plus, Save, CheckSquare, Square, User, Calendar, ChevronDown, ChevronUp, GripVertical } from 'lucide-react-native';
import { getTasks, updateTasks } from '../services/ApiService';

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params || {};  
  const [taskDetails, setTaskDetails] = useState({ taskLists: [] });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newTaskListName, setNewTaskListName] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [expandedLists, setExpandedLists] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTasks(taskId);
        if (data) {
          setTaskDetails({
            ...data,
            taskLists: Array.isArray(data.taskLists) ? data.taskLists : [],
          });
          setTitle(data.text || '');
          setDescription(data.description || '');
          setStartDate(data.startDate ? new Date(data.startDate) : null);
          setEndDate(data.endDate ? new Date(data.endDate) : null);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchData();
  }, [taskId]);

  const saveTaskData = async () => {
    try {
      await updateTasks(taskId, {
        text: title,
        description,
        startDate,
        endDate,
        taskLists: taskDetails.taskLists || [],
      });
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error);
    }
  };


  const handleAddTaskList = () => {
    const newList = { 
      id: Date.now().toString(), 
      name: '', 
      items: [] 
    };

    const updatedLists = [...taskDetails.taskLists, newList];

    setTaskDetails((prev) => ({
      ...prev,
      taskLists: updatedLists
    }));

    setExpandedLists((prev) => ({
      ...prev,
      [updatedLists.length - 1]: true
    }));
  };

  const handleUpdateTaskListName = (listId, name) => {
    const updatedLists = taskDetails.taskLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          name,
        };
      }
      return list;
    });
    setTaskDetails({ ...taskDetails, taskLists: updatedLists });
  };

  const handleAddListItem = (listId) => {
    const updatedLists = taskDetails.taskLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          items: [...list.items, { id: Date.now().toString(), text: 'Новый элемент', completed: false }],
        };
      }
      return list;
    });
    setTaskDetails({ ...taskDetails, taskLists: updatedLists });
  };

  const handleToggleItem = (listId, itemId) => {
    const updatedLists = taskDetails.taskLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      }
      return list;
    });
    setTaskDetails({ ...taskDetails, taskLists: updatedLists });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Верхний заголовок */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={28} color="#000" />
        </TouchableOpacity>
        <TextInput style={styles.taskTitle} value={title} onChangeText={setTitle} placeholder="Название задачи" />
        <TouchableOpacity onPress={saveTaskData}>
          <Save size={28} color="#007bff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.columnName}><Text style={styles.italic}>в списке</Text> "Название колонки"</Text>

      {/* Описание */}
      <TextInput style={styles.descriptionInput} placeholder="Добавить описание карточки..." value={description} onChangeText={setDescription} multiline />

      {/* Участники */}
      <TouchableOpacity style={styles.optionButton}>
        <User size={20} color="#007bff" />
        <Text style={styles.optionText}>Участники...</Text>
      </TouchableOpacity>

      {/* Даты */}
      <TouchableOpacity style={styles.optionButton} onPress={() => setShowStartDatePicker(true)}>
        <Calendar size={20} color="#007bff" />
        <Text style={styles.optionText}>Начало...</Text>
      </TouchableOpacity>
      
      
      <TouchableOpacity style={styles.optionButton} onPress={() => setShowEndDatePicker(true)}>
        <Calendar size={20} color="#ff4500" />
        <Text style={styles.optionText}>Дата выполнения...</Text>
      </TouchableOpacity>
      

      {/* Списки задач */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Списки задач</Text>
        <TouchableOpacity onPress={handleAddTaskList}>
          <Plus size={20} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Вывод всех списков задач */}
      {taskDetails.taskLists.map((list, index) => (
        <View key={list.id} style={styles.taskList}>
          {/* Заголовок списка задач */}
          <View style={styles.taskListHeader}>
            <TouchableOpacity onPress={() => setExpandedLists({ ...expandedLists, [index]: !expandedLists[index] })}>
              {expandedLists[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </TouchableOpacity>
            <TextInput
              style={styles.taskListTitle}
              placeholder="Название списка"
              value={list.name}
              onChangeText={(text) => handleUpdateTaskListName(list.id, text)}
            />
            <GripVertical size={20} color="#666" />
          </View>

          {/* Элементы списка задач */}
          {expandedLists[index] && (
            <>
              {list.items.map((item) => (
                <View key={item.id} style={styles.listItem}>
                  <TouchableOpacity onPress={() => handleToggleItem(list.id, item.id)}>
                    {item.completed ? <CheckSquare size={18} color="green" /> : <Square size={18} color="gray" />}
                  </TouchableOpacity>
                  <Text style={[styles.listItemText, item.completed && styles.completedText]}>{item.text}</Text>
                  <GripVertical size={20} color="#666" />
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={() => handleAddListItem(list.id)}>
                <Plus size={16} color="#007bff" />
                <Text style={styles.addText}>Добавить элемент</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  taskTitle: { fontSize: 22, fontWeight: 'bold', flex: 1, marginLeft: 10 },
  columnName: { fontSize: 16, color: 'gray', marginBottom: 10 },
  descriptionInput: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 5, minHeight: 50 },
  optionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  optionText: { fontSize: 16, marginLeft: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 5, marginBottom: 10 },
  addButton: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  addText: { fontSize: 16, marginLeft: 5, color: '#007bff' },
  taskList: { backgroundColor: '#f3f3f3', padding: 10, borderRadius: 8, marginTop: 10 },
  taskListHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskListTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, marginLeft: 10 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, marginLeft: 10 },
  listItemText: { fontSize: 16, marginLeft: 10, flex: 1 },
  completedText: { textDecorationLine: 'line-through', color: 'gray' },
});

export default TaskDetailScreen;
