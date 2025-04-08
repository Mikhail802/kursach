import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/ApiService';
import { API_URL } from '../services/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Ошибка загрузки из AsyncStorage:', err);
      }
    };
    loadUser();
  }, []);

  const login = async (identifier, password) => {
    try {
      const result = await loginUser(identifier, password); // 👈 важный вызов!
  
      if (result?.user && result?.token) {
        const userWithToken = { ...result.user, token: result.token };
        await AsyncStorage.setItem('user', JSON.stringify(userWithToken));
        await AsyncStorage.setItem('token', result.token);
        setUser(userWithToken);
        setToken(result.token);
        return true;
      }
  
      return false;
    } catch (err) {
      console.error('❌ Ошибка логина:', err);
      return false;
    }
  };
  
    

  const loginWithGoogle = async (idToken) => {
    try {
      const res = await fetch(`${API_URL}/users/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка авторизации через Google');

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (err) {
      console.error('❌ Ошибка входа через Google:', err);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
