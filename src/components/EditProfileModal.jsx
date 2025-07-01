import { useState } from 'react';
import styles from './EditProfileModal.module.css';

function EditProfileModal({ isOpen, onClose, fieldName, currentValue, onSave }) {
  const [value, setValue] = useState(currentValue || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Пожалуйста, введите корректный email');
        return;
      }
    } else if (fieldName === 'phone') {
      const phoneRegex = /^\+?[0-9]{10,12}$/;
      if (!phoneRegex.test(value.replace(/\D/g, ''))) {
        setError('Пожалуйста, введите корректный номер телефона');
        return;
      }
    } else if (fieldName === 'name' && !value.trim()) {
      setError('Имя не может быть пустым');
      return;
    }

    onSave(value);
  };

  if (!isOpen) return null;

  const getFieldLabel = () => {
    switch (fieldName) {
      case 'name': return 'Имя';
      case 'email': return 'Email';
      case 'phone': return 'Телефон';
      default: return fieldName;
    }
  };

  const getPlaceholder = () => {
    switch (fieldName) {
      case 'name': return 'Введите ваше имя';
      case 'email': return 'Введите ваш email';
      case 'phone': return 'Введите ваш телефон';
      default: return 'Введите значение';
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2 className={styles.title}>Изменить {getFieldLabel().toLowerCase()}</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>{getFieldLabel()}</label>
            <input
              type={fieldName === 'email' ? 'email' : 'text'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={getPlaceholder()}
              className={styles.input}
            />
            {error && <div className={styles.error}>{error}</div>}
          </div>
          
          <div className={styles.buttons}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Отмена
            </button>
            <button type="submit" className={styles.saveBtn}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal; 