import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../services/config.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Автоматическая авторизация при запуске
  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    console.log("📤 Попытка логина:", email, password);
  
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const text = await res.text();
      console.log("📩 Ответ от сервера (текст):", res.status, text);
  
      if (!res.ok) {
        try {
          const error = JSON.parse(text);
          throw new Error(error.message || "Ошибка входа");
        } catch (e) {
          throw new Error("Неверный формат ответа от сервера");
        }
      }
  
      const data = JSON.parse(text);
      const user = data?.data?.user;
  
      if (user && user.id) {
        setUser(user);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        return true;
      }
  
      throw new Error("Неверные данные пользователя");
  
    } catch (err) {
      console.error("❌ Ошибка логина:", err);
      return false;
    }
  };
  
  

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };
  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
