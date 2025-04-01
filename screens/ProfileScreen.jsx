import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { Bell, User, Users, LogOut } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Выход",
      "Вы уверены, что хотите выйти?",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Выйти", onPress: () => logout() }
      ]
    );
  };

  const handleFriends = () => {
    navigation.navigate("Friends");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
        <TouchableOpacity>
          <Bell size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <User size={20} color="#000" style={styles.icon} />
          <Text style={styles.buttonText}>{user?.name || 'Пользователь'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFriends}>
          <Users size={20} color="#000" style={styles.icon} />
          <Text style={styles.buttonText}>Друзья</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <LogOut size={20} color="#000" style={styles.icon} />
          <Text style={styles.buttonText}>Выход</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  buttonsContainer: { marginTop: 10 },
  button: {
    flexDirection: 'row', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc',
  },
  icon: { marginRight: 10 },
  buttonText: { fontSize: 16, color: '#000' },
});

export default ProfileScreen;
