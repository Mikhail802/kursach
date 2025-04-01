import { API_URL } from './config';

export const getRooms = async () => {
  try {
    const response = await fetch(`${API_URL}/rooms`);
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    const data = await response.json();
    return data.rooms || [];
  } catch (error) {
    console.error('Ошибка при загрузке комнат:', error);
    return [];
  }
};

export const createRoom = async (name, theme) => {
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, theme }),
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка при создании комнаты: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка создания комнаты:', error);
      return null;
    }
  };
  
 export const getColumns = async (roomId) => {
    try {
      const response = await fetch(`${API_URL}/columns?roomId=${roomId}`);
      if (!response.ok) {
        throw new Error(`Ошибка получения колонок: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Ошибка при запросе колонок:", error);
      return [];
    }
  };

  export const createColumn = async (roomId, title) => {
    try {
      const response = await fetch(`${API_URL}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: roomId, title }), // ✅ Ключевой момент
      });
  
      const text = await response.text(); // временно для отладки
      console.log('Ответ сервера:', text);
  
      if (!response.ok) throw new Error('Ошибка при создании колонки');
      return JSON.parse(text);
    } catch (error) {
      console.error('Ошибка createColumn:', error);
      return null;
    }
  };
  
  
  
 export const createTask = async (columnId, text) => {
     try {
       const requestBody = { column_id: columnId, text };
       console.log("Отправка запроса createTask:", requestBody);
   
       const response = await fetch(`${API_URL}/tasks`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(requestBody),
       });
   
       if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`Ошибка создания задачи: ${response.status} ${response.statusText} - ${errorText}`);
       }
   
       return await response.json();
     } catch (error) {
       console.error("Ошибка при создании задачи:", error);
       return null;
     }
   };
   
  

  export const updateColumn = async (columnId, title) => {
    try {
      const res = await fetch(`${API_URL}/columns/${columnId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      return await res.json();
    } catch (err) {
      console.error('Ошибка updateColumn:', err);
      return null;
    }
  };
  
  export const deleteColumn = async (columnId) => {
    try {
      const res = await fetch(`${API_URL}/columns/${columnId}`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.error('Ошибка deleteColumn:', err);
      return false;
    }
  };
  
  export const updateTask = async (taskId, text) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      return await res.json();
    } catch (err) {
      console.error('Ошибка updateTask:', err);
      return null;
    }
  };
  
  export const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.error('Ошибка deleteTask:', err);
      return false;
    }
  };
  

  export const loginUser = async (email, password) => {
    try {
      console.log('📤 Отправляем POST /users/login');
  
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const text = await response.text();
      console.log('📥 RAW ответ от сервера:', text);
  
      const data = JSON.parse(text);
  
      if (!response.ok) {
        console.warn('❌ Ошибка авторизации:', response.status, data.message);
        return null;
      }
  
      console.log('✅ Авторизация успешна:', data);
      return {
        token: data.data?.token,
        user: data.data?.user,
      };
    } catch (err) {
      console.error('💥 Ошибка loginUser:', err);
      return null;
    }
  };
  
  
  export const registerUser = async (name, username, email, password) => {
    try {
      console.log('📤 Отправляем POST /users/register');
  
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      });
  
      const text = await response.text();
      console.log('📥 RAW ответ от сервера:', text);
  
      const data = JSON.parse(text);
  
      if (!response.ok) {
        console.warn('❌ Ошибка регистрации:', response.status, data.message);
        return null;
      }
  
      console.log('✅ Распакованный data:', data);
      return data.data?.user || null;
    } catch (err) {
      console.error('💥 Ошибка registerUser:', err);
      return null;
    }
  };
  
  
  