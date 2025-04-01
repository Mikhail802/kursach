import { API_URL } from '../services/config.js';


import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { registerUser } from '../services/ApiService';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');



  const handleRegister = async () => {
    if (!isValidEmail(email) || !isStrongPassword(password)) return;
    if (password !== confirmPassword) return;
  
    // Отправка кода на email
    try {
      const res = await fetch(`${API_URL}/email/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, from: 'register' }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        navigation.navigate("VerifyEmail", { email, password,  name, username, from: 'register' });
      } else {
        alert(data.error || 'Ошибка отправки кода');
      }
    } catch (err) {
      alert("Ошибка сети при отправке кода");
    }
    

  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername}/>
      <TextInput style={styles.input} placeholder="Имя" value={name} onChangeText={setName}/>
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Подтвердите пароль" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <Button title="Зарегистрироваться" onPress={handleRegister} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  input: { height: 45, borderColor: '#aaa', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  link: { color: '#007bff', marginTop: 15, textAlign: 'center' },
});

export default RegisterScreen;
