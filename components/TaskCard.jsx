import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const TaskCard = ({ task, onLongPress, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(task)}
      onLongPress={() => onLongPress(task)}
    >
      <Text style={styles.text}>{task.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  text: {
    fontSize: 16,
  },
});

export default TaskCard;
