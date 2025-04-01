
import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { API_URL } from '../services/config';
import { registerUser } from '../services/ApiService';

const VerifyEmailScreen = ({ route, navigation }) => {
  const { email, password, name, username, from } = route.params;
  console.log("🧾 Получены данные из params:", route.params);
  const [code, setCode] = useState("");
  const handleVerify = async () => {
    const res = await fetch(`${API_URL}/email/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (res.ok) {
      if (from === "register") {
        const registerRes = await registerUser(name, username, email, password);
        if (registerRes?.id) {
          alert("Регистрация завершена!");
          navigation.navigate("Login");
        } else {
          alert("Ошибка при создании аккаунта");
        }
      } else if (from === "recover") {
        alert("Email подтвержден. Установите новый пароль.");
        navigation.navigate("NewPassword", { email });
      }      
    } else {
      alert("Неверный код");
    }
  };

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Подтверждение Email</Text>
      <Text style={styles.subtitle}>Введите код, отправленный на {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Код подтверждения"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <Button title="Подтвердить" onPress={handleVerify} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  input: { height: 45, borderColor: '#aaa', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginBottom: 15 },
});

export default VerifyEmailScreen;
