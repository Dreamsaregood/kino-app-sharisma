import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites должен использоваться внутри FavoritesProvider');
  }
  return context;
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка избранного при входе пользователя
  useEffect(() => {
    const loadFavorites = () => {
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (err) {
        console.error('Ошибка при загрузке избранного:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Сохранение избранного при изменении
  useEffect(() => {
    if (user && favorites.length > 0) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addToFavorites = async (itemId, type) => {
    if (!user) return false;

    try {
      const newFavorite = {
        id: Date.now().toString(),
        userId: user.id,
        itemId,
        type,
        addedAt: new Date().toISOString()
      };
      
      setFavorites(prev => [...prev, newFavorite]);
      return true;
    } catch (err) {
      console.error('Ошибка при добавлении в избранное:', err);
      return false;
    }
  };

  const removeFromFavorites = async (itemId, type) => {
    if (!user) return false;

    try {
      setFavorites(prev => prev.filter(f => !(f.itemId === itemId && f.type === type)));
      return true;
    } catch (err) {
      console.error('Ошибка при удалении из избранного:', err);
      return false;
    }
  };

  const isFavorite = (itemId, type) => {
    return favorites.some(f => f.itemId === itemId && f.type === type);
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
} 