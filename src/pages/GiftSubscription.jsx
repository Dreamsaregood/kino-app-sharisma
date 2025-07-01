import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './GiftSubscription.module.css';

const subscriptionPlans = [
  {
    id: 'monthly',
    title: '1 Мес.',
    price: 499,
    priceStr: '499 Р.',
    days: 30
  },
  {
    id: 'halfyear',
    title: '6 Мес.',
    price: 1390,
    priceStr: '1 390 Р.',
    days: 180
  },
  {
    id: 'annual',
    title: '12 Мес.',
    price: 2590,
    priceStr: '2 590 Р.',
    days: 365
  }
];

function GiftSubscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    navigate('/');
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleGiftSubscription = async () => {
    if (!selectedPlan) {
      setError('Пожалуйста, выберите план подписки');
      return;
    }

    if (!recipientEmail || !validateEmail(recipientEmail)) {
      setError('Пожалуйста, введите корректный email получателя');
      return;
    }

    if (!recipientName.trim()) {
      setError('Пожалуйста, введите имя получателя');
      return;
    }

    if (!user) {
      setError('Пожалуйста, войдите в систему для оформления подарочной подписки');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      
      // Создаем новую подарочную подписку
      const giftSubscription = {
        id: `gift_${Date.now()}`,
        fromUserId: user.id,
        recipientEmail: recipientEmail.toLowerCase(),
        recipientName: recipientName.trim(),
        message: giftMessage.trim() || null,
        subscriptionType: plan.id,
        subscriptionTitle: plan.title,
        subscriptionPrice: plan.price,
        createdAt: new Date().toISOString(),
        activatedAt: null,
        activatedByUserId: null,
        expiresAt: null,
        status: 'pending'
      };

      // Сохраняем в базу данных
      const response = await fetch('http://localhost:3001/giftSubscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(giftSubscription)
      });

      if (!response.ok) {
        throw new Error('Ошибка при сохранении подарочной подписки');
      }

      // Отправляем email получателю (в реальном приложении)
      // await sendGiftEmail(recipientEmail, recipientName, giftSubscription);
      
      // После успешной отправки
      navigate('/account', { 
        state: { 
          giftSent: true,
          recipientName,
          planTitle: plan.title
        }
      });
    } catch (err) {
      setError('Произошла ошибка при оформлении подарочной подписки. Попробуйте позже.');
      console.error('Gift subscription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.giftSubscribeBg}>
      <div className={styles.giftSubscribeBox}>
        <button onClick={handleClose} className={styles.closeBtn}>×</button>
        <h2 className={styles.title}>ПОДАРИТЬ ПОДПИСКУ</h2>
        <div className={styles.subtitle}>
          Подарите своим близким доступ к тысячам фильмов и сериалов
        </div>
        
        <div className={styles.optionsRow}>
          {subscriptionPlans.map((plan) => (
            <button
              key={plan.id}
              className={`${styles.optionCard} ${selectedPlan === plan.id ? styles.optionSelected : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className={styles.optionTitle}>{plan.title}</div>
              <div className={styles.optionPrice}>{plan.priceStr}</div>
              {selectedPlan === plan.id && (
                <div className={styles.selectedMark}>✓</div>
              )}
            </button>
          ))}
        </div>

        <div className={styles.formGroup}>
          <input
            type="email"
            placeholder="Email получателя"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Имя получателя"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <textarea
            placeholder="Добавьте персональное сообщение (необязательно)"
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            className={styles.textarea}
            maxLength={200}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}
        
        <button 
          className={styles.giftBtn} 
          onClick={handleGiftSubscription}
          disabled={isProcessing}
        >
          {isProcessing ? 'ОФОРМЛЕНИЕ...' : 'ПОДАРИТЬ ПОДПИСКУ'}
        </button>

        <div className={styles.terms}>
          После оплаты получатель получит email с инструкцией по активации подписки
        </div>
      </div>
    </div>
  );
}

export default GiftSubscription; 