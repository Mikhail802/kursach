import React, { useState } from "react";
import {
  View, TextInput, Text, StyleSheet, TouchableOpacity, Alert
} from "react-native";
import { API_URL } from '../services/config';
import { registerUser } from '../services/ApiService';
import { Mail, ArrowLeft } from 'lucide-react-native';

const VerifyEmailScreen = ({ route, navigation }) => {
  const { email, password, name, username, from } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Введите код подтверждения');
      return;
    }
    setError('');

    const res = await fetch(`${API_URL}/email/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (res.ok) {
      if (from === "register") {
        const registerRes = await registerUser(name, username, email, password);
        if (registerRes?.id) {
          Alert.alert("Успех", "Регистрация завершена!");
          navigation.navigate("Login");
        } else {
          Alert.alert("Ошибка", "Не удалось создать аккаунт");
        }
      } else if (from === "recover") {
        // убран Alert
        navigation.navigate("NewPassword", { email });
      }
    } else {
      Alert.alert("Ошибка", "Неверный код подтверждения");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Подтверждение Email</Text>
      <Text style={styles.subtitle}>Введите код, отправленный на {email}</Text>

      <View style={styles.inputContainer}>
        <Mail size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Код подтверждения"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
        />
      </View>
      <Text style={[styles.error, !error && styles.errorPlaceholder]}>
        {error || ' '}
      </Text>

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Подтвердить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', justifyContent: 'center', padding: 20 },
  backButton: { position: 'absolute', top: 50, left: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#333' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#555' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 12, marginBottom: 5,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: '#333' },
  error: { minHeight: 18, fontSize: 13, color: '#ff4d4f', marginBottom: 10 },
  errorPlaceholder: { color: 'transparent' },
  verifyButton: {
    backgroundColor: '#4CAF50', borderRadius: 12,
    paddingVertical: 14, marginTop: 10, alignItems: 'center', elevation: 2,
  },
  verifyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default VerifyEmailScreen;
