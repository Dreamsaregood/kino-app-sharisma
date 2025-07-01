import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

function Login() {
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+7');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Всегда начинаем с +7
    if (!value.startsWith('+7')) {
      value = '+7' + value.substring(2);
    }

    // Удаляем все кроме цифр и +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Форматируем номер
    let formatted = '+7';
    if (cleaned.length > 1) {
      const numbers = cleaned.substring(2);
      if (numbers.length > 0) formatted += ` (${numbers.substring(0, 3)}`;
      if (numbers.length > 3) formatted += `) ${numbers.substring(3, 6)}`;
      if (numbers.length > 6) formatted += `-${numbers.substring(6, 8)}`;
      if (numbers.length > 8) formatted += `-${numbers.substring(8, 10)}`;
    }

    // Ограничиваем длину
    if (formatted.length <= 18) {
      setPhone(formatted);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (tab === 'phone' && phone.length < 18) {
      setError('Введите полный номер телефона');
      return;
    }

    if (tab === 'email' && !email.includes('@')) {
      setError('Введите корректный email');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (isRegistering && !name.trim()) {
      setError('Введите имя');
      return;
    }

    try {
      if (isRegistering) {
        // Регистрация
        const result = await register({
          name: name.trim(),
          email: tab === 'email' ? email.trim() : '',
          phone: tab === 'phone' ? phone : '',
          password
        });

        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Ошибка регистрации');
        }
      } else {
        // Вход
        const loginData = {
          password,
          ...(tab === 'email' ? { email: email.trim() } : { phone })
        };
        
        const result = await login(loginData);
        
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Ошибка входа');
        }
      }
    } catch (error) {
      setError('Произошла ошибка при обработке запроса');
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className={styles.loginBg}>
      <div className={styles.loginBox}>
        <button onClick={handleClose} className={styles.closeBtn}>←</button>
        <h2 className={styles.title}>
          {isRegistering ? 'Регистрация' : 'Войти или зарегистрироваться'}
        </h2>
        
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${styles.tabLeft} ${tab === 'email' ? styles.tabActive : ''}`}
            onClick={() => setTab('email')}
          >
            Почта
          </button>
          <button
            className={`${styles.tab} ${styles.tabRight} ${tab === 'phone' ? styles.tabActive : ''}`}
            onClick={() => setTab('phone')}
          >
            Телефон
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Ваше имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Иван Петров"
                className={styles.input}
              />
            </div>
          )}

          {tab === 'email' ? (
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@mail.ru"
                className={styles.input}
              />
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label className={styles.label}>Номер телефона</label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 (999) 999-99-99"
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.loginBtn}>
            {isRegistering ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <button 
          className={styles.regBtn}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Уже есть аккаунт? Войти' : 'Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
}

export default Login;