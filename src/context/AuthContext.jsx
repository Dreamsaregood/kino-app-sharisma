import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const formatPhone = (phone) => {
  // Очищаем телефон от всего кроме цифр
  const cleaned = phone.replace(/\D/g, '');
  // Убираем 8 или 7 в начале
  const normalized = cleaned.startsWith('8') || cleaned.startsWith('7') 
    ? cleaned.slice(1) 
    : cleaned;
  // Форматируем в стандартный вид
  return `+7${normalized}`;
};

const generateUserId = () => {
  // Генерируем более короткий и читаемый ID
  return Math.random().toString(36).substring(2, 15);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Проверяем наличие пользователя в localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (loginData) => {
    try {
      let query = '';
      if (loginData.email) {
        query = `email=${encodeURIComponent(loginData.email.trim())}`;
      } else if (loginData.phone) {
        const formattedPhone = formatPhone(loginData.phone);
        query = `phone=${encodeURIComponent(formattedPhone)}`;
      }
      
      const response = await fetch(`http://localhost:3001/users?${query}`);
      if (!response.ok) {
        throw new Error('Ошибка сети при попытке входа');
      }

      const users = await response.json();
      
      if (users.length === 0) {
        return { 
          success: false, 
          error: loginData.email 
            ? 'Пользователь с такой почтой не найден' 
            : 'Пользователь с таким телефоном не найден' 
        };
      }

      const user = users[0];
      if (user.password !== loginData.password) {
        return { success: false, error: 'Неверный пароль' };
      }

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Ошибка входа:', error);
      return { success: false, error: 'Ошибка входа: ' + error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Форматируем данные перед проверкой
      const formattedPhone = userData.phone ? formatPhone(userData.phone) : '';
      const formattedEmail = userData.email ? userData.email.trim().toLowerCase() : '';

      // Проверяем существующих пользователей
      const queries = [];
      if (formattedEmail) {
        queries.push(`email=${encodeURIComponent(formattedEmail)}`);
      }
      if (formattedPhone) {
        queries.push(`phone=${encodeURIComponent(formattedPhone)}`);
      }
      
      const checkResponse = await fetch(`http://localhost:3001/users?${queries.join('&')}`);
      if (!checkResponse.ok) {
        throw new Error('Ошибка сети при проверке существующих пользователей');
      }

      const existingUsers = await checkResponse.json();
      
      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        if (existingUser.email === formattedEmail) {
          return { success: false, error: 'Пользователь с такой почтой уже существует' };
        }
        if (existingUser.phone === formattedPhone) {
          return { success: false, error: 'Пользователь с таким телефоном уже существует' };
        }
      }

      // Создаем нового пользователя
      const newUser = {
        ...userData,
        email: formattedEmail,
        phone: formattedPhone,
        id: generateUserId(),
        createdAt: new Date().toISOString()
      };

      const registerResponse = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (!registerResponse.ok) {
        throw new Error('Ошибка сети при регистрации пользователя');
      }

      const savedUser = await registerResponse.json();
      localStorage.setItem('user', JSON.stringify(savedUser));
      setUser(savedUser);
      return { success: true };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return { success: false, error: 'Ошибка регистрации: ' + error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    try {
      // Валидация данных
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          return { success: false, error: 'Некорректный email' };
        }
      }

      if (updateData.phone) {
        const phoneRegex = /^\+?[0-9]{10,12}$/;
        if (!phoneRegex.test(updateData.phone.replace(/\D/g, ''))) {
          return { success: false, error: 'Некорректный номер телефона' };
        }
      }

      if (updateData.name && !updateData.name.trim()) {
        return { success: false, error: 'Имя не может быть пустым' };
      }

      // Обновляем данные пользователя
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении профиля');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      return { 
        success: false, 
        error: 'Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте позже.' 
      };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}; 