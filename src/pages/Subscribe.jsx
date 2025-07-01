import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Subscribe.module.css';

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

function Subscribe() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    navigate('/');
  };

  const calculateEndDate = (days) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    return endDate.toISOString().split('T')[0];
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Пожалуйста, выберите план подписки');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      const subscriptionEnd = calculateEndDate(plan.days);
      
      await updateProfile({
        ...user,
        subscription: plan.title,
        subscriptionEnd: subscriptionEnd,
        subscriptionType: plan.id,
        subscriptionPrice: plan.price
      });

      navigate('/account');
    } catch (err) {
      setError('Произошла ошибка при оформлении подписки. Попробуйте позже.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.subscribeBg}>
      <div className={styles.subscribeBox}>
        <button onClick={handleClose} className={styles.closeBtn}>×</button>
        <h2 className={styles.title}>ВЫБЕРИТЕ ДЛИТЕЛЬНОСТЬ ПОДПИСКИ</h2>
        <div className={styles.subtitle}>
          Первые 30 дней бесплатно. После пробного периода будет списана оплата согласно выбранному тарифу.
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

        {error && <div className={styles.error}>{error}</div>}
        
        <button 
          className={styles.subscribeBtn} 
          onClick={handleSubscribe}
          disabled={isProcessing || !selectedPlan}
        >
          {isProcessing ? 'ОФОРМЛЕНИЕ...' : 'ОФОРМИТЬ ПОДПИСКУ'}
        </button>

        <div className={styles.terms}>
          Нажимая кнопку, вы соглашаетесь с условиями использования сервиса
        </div>
      </div>
    </div>
  );
}

export default Subscribe; 