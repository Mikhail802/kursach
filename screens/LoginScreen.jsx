
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    console.log("▶️ handleLogin triggered");
    const success = await login(email, password);
    console.log("✅ Login success:", success);
    if (!success) {
      alert("Ошибка входа");
    }
  };  

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Пароль" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Войти" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Нет аккаунта? Зарегистрируйтесь</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
        <Text style={styles.link}>Забыли пароль?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  link: { color: '#007bff', marginTop: 12, textAlign: 'center' },
});

export default LoginScreen;
