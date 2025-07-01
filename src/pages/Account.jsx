import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import styles from './Account.module.css';

function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [giftSubscriptions, setGiftSubscriptions] = useState([]);
  const [isActivating, setIsActivating] = useState(false);
  const [showGiftMessage, setShowGiftMessage] = useState(location.state?.giftSent || false);

  useEffect(() => {
    if (user) {
      fetchGiftSubscriptions();
    }
  }, [user]);

  useEffect(() => {
    // Устанавливаем сообщение, если оно пришло из location state
    if (location.state?.giftSent) {
      setShowGiftMessage(true);
    }
  }, [location.state]);

  const fetchGiftSubscriptions = async () => {
    try {
      // Получаем подарочные подписки для текущего пользователя (по email)
      const response = await fetch(`http://localhost:3001/giftSubscriptions?recipientEmail=${user.email}&status=pending`);
      if (response.ok) {
        const data = await response.json();
        setGiftSubscriptions(data);
      }
    } catch (error) {
      console.error('Error fetching gift subscriptions:', error);
    }
  };

  const handleActivateGift = async (giftSubscription) => {
    if (!user) return;
    
    setIsActivating(true);
    try {
      // Обновляем статус подарочной подписки
      const activateResponse = await fetch(`http://localhost:3001/giftSubscriptions/${giftSubscription.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'activated',
          activatedAt: new Date().toISOString(),
          activatedByUserId: user.id,
          expiresAt: new Date(Date.now() + (giftSubscription.subscriptionType === 'monthly' ? 30 : 
                                           giftSubscription.subscriptionType === 'halfyear' ? 180 : 365) * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      if (!activateResponse.ok) {
        throw new Error('Ошибка при активации подписки');
      }

      // Обновляем данные пользователя
      const updatedUser = {
        ...user,
        subscription: giftSubscription.subscriptionTitle,
        subscriptionEnd: new Date(Date.now() + (giftSubscription.subscriptionType === 'monthly' ? 30 : 
                                               giftSubscription.subscriptionType === 'halfyear' ? 180 : 365) * 24 * 60 * 60 * 1000).toISOString(),
        subscriptionType: giftSubscription.subscriptionType,
        subscriptionPrice: giftSubscription.subscriptionPrice
      };

      const result = await updateProfile(updatedUser);
      
      if (result.success) {
        // Обновляем список подарочных подписок
        await fetchGiftSubscriptions();
        // Скрываем сообщение об успешной отправке после активации
        setShowGiftMessage(false);
        // Очищаем состояние location
        navigate('.', { replace: true, state: {} });
      } else {
        throw new Error(result.error || 'Ошибка при обновлении профиля');
      }
    } catch (error) {
      console.error('Error activating gift subscription:', error);
      setUpdateError('Произошла ошибка при активации подписки');
    } finally {
      setIsActivating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubscribe = () => {
    navigate('/subscribe');
  };

  const handleEdit = (fieldName) => {
    setEditingField(fieldName);
    setIsModalOpen(true);
    setUpdateError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
    setUpdateError(null);
  };

  const handleSave = async (newValue) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updatedData = { ...user };
      updatedData[editingField] = newValue;

      const result = await updateProfile(updatedData);
      
      if (result.success) {
        setIsModalOpen(false);
        setEditingField(null);
      } else {
        setUpdateError(result.error || 'Произошла ошибка при обновлении данных');
      }
    } catch (error) {
      setUpdateError('Произошла ошибка при обновлении данных');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getSubscriptionStatus = () => {
    if (!user.subscription) return 'Нет активной подписки';
    const endDate = new Date(user.subscriptionEnd);
    const now = new Date();
    if (endDate < now) return 'Подписка истекла';
    return user.subscription;
  };

  const getDaysLeft = () => {
    if (!user.subscriptionEnd) return null;
    const endDate = new Date(user.subscriptionEnd);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const daysLeft = getDaysLeft();
  const hasActiveSubscription = daysLeft > 0;

  return (
    <div className={styles.accountBg}>
      <div className={styles.accountContainer}>
        <h1 className={styles.title}>Личный кабинет</h1>
        
        <div className={styles.profileSection}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {user.avatar ? (
                <img src={user.avatar} alt="Аватар" />
              ) : (
                <span>{user.name[0]}</span>
              )}
            </div>
            <button className={styles.changeAvatarBtn}>Изменить фото</button>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Имя</span>
              <span className={styles.value}>{user.name}</span>
              <button className={styles.editBtn} onClick={() => handleEdit('name')}>✎</button>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{user.email || '—'}</span>
              <button className={styles.editBtn} onClick={() => handleEdit('email')}>✎</button>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Телефон</span>
              <span className={styles.value}>{user.phone || '—'}</span>
              <button className={styles.editBtn} onClick={() => handleEdit('phone')}>✎</button>
            </div>
            {updateError && <div className={styles.updateError}>{updateError}</div>}
          </div>
        </div>

        <div className={styles.subscriptionSection}>
          <h2 className={styles.sectionTitle}>Подписка</h2>
          <div className={styles.subscriptionInfo}>
            <div className={styles.subscriptionStatus}>
              <span className={styles.statusLabel}>Текущий тариф</span>
              <span className={`${styles.statusValue} ${hasActiveSubscription ? styles.active : ''}`}>
                {getSubscriptionStatus()}
              </span>
            </div>
            {user.subscriptionEnd && (
              <div className={styles.subscriptionDate}>
                <span className={styles.dateLabel}>Действует до</span>
                <span className={styles.dateValue}>
                  {formatDate(user.subscriptionEnd)}
                  {daysLeft > 0 && (
                    <span className={styles.daysLeft}>
                      (осталось {daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'})
                    </span>
                  )}
                </span>
              </div>
            )}
            {user.subscriptionPrice && (
              <div className={styles.subscriptionPrice}>
                <span className={styles.priceLabel}>Стоимость</span>
                <span className={styles.priceValue}>{user.subscriptionPrice} Р.</span>
              </div>
            )}
            <button 
              className={styles.extendBtn} 
              onClick={handleSubscribe}
            >
              {hasActiveSubscription ? 'Продлить подписку' : 'Оформить подписку'}
            </button>
          </div>
        </div>

        {/* Gift Subscriptions Section */}
        {giftSubscriptions.length > 0 && (
          <div className={styles.giftSubscriptionsSection}>
            <h2 className={styles.sectionTitle}>Подарочные подписки</h2>
            <div className={styles.giftsList}>
              {giftSubscriptions.map((gift) => (
                <div key={gift.id} className={styles.giftCard}>
                  <div className={styles.giftInfo}>
                    <div className={styles.giftFrom}>
                      От: {gift.recipientName}
                    </div>
                    <div className={styles.giftPlan}>
                      Тариф: {gift.subscriptionTitle}
                    </div>
                    {gift.message && (
                      <div className={styles.giftMessage}>
                        "{gift.message}"
                      </div>
                    )}
                  </div>
                  <button
                    className={styles.activateBtn}
                    onClick={() => handleActivateGift(gift)}
                    disabled={isActivating}
                  >
                    {isActivating ? 'Активация...' : 'Активировать'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showGiftMessage && location.state?.giftSent && (
          <div className={styles.giftSentMessage}>
            Подписка {location.state.planTitle} успешно отправлена {location.state.recipientName}
          </div>
        )}

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Выйти из аккаунта
        </button>

        <EditProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          fieldName={editingField}
          currentValue={user[editingField]}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default Account; 