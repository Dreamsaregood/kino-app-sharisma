import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../context/MoviesContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import styles from './Favorites.module.css';

function Favorites() {
  const { user } = useAuth();
  const { favorites, removeFromFavorites } = useFavorites();
  const { getMovieById, getSeriesById } = useMovies();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!user || !favorites.length) {
        setFavoriteItems([]);
        setLoading(false);
        return;
      }

      try {
        const items = await Promise.all(
          favorites.map(async (favorite) => {
            const fetchFunction = favorite.type === 'movie' ? getMovieById : getSeriesById;
            const details = await fetchFunction(favorite.itemId);
            return {
              ...details,
              type: favorite.type,
              addedAt: favorite.addedAt
            };
          })
        );

        setFavoriteItems(items.filter(Boolean));
      } catch (error) {
        console.error('Ошибка при загрузке избранного:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [user, favorites, getMovieById, getSeriesById]);

  const handleRemoveFavorite = async (itemId, type) => {
    const success = await removeFromFavorites(itemId, type);
    if (success) {
      setFavoriteItems(prev => prev.filter(item => !(item.id === itemId && item.type === type)));
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Избранное</h1>
        <p className={styles.message}>Войдите в аккаунт, чтобы добавлять фильмы и сериалы в избранное</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Избранное</h1>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (!favoriteItems.length) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Избранное</h1>
        <p className={styles.message}>У вас пока нет избранных фильмов и сериалов</p>
        <p className={styles.message}>Добавляйте фильмы и сериалы в избранное, нажимая на звёздочку ☆</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Избранное</h1>
      <div className={styles.grid}>
        {favoriteItems.map((item) => (
          <div key={`${item.type}-${item.id}`} className={styles.card}>
            <Link to={`/${item.type === 'movie' ? 'movie' : 'series'}/${item.id}`}>
              <div className={styles.imageWrapper}>
                <img
                  src={item.poster}
                  alt={item.title}
                  className={styles.poster}
                />
                <div className={styles.cardOverlay}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <span className={styles.cardBadge}>
                        {item.rating} ★ • {item.year} • {item.type === 'movie' ? 'Фильм' : 'Сериал'}
                      </span>
                      <p className={styles.cardDescription}>{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <button
              className={`${styles.favoriteButton} ${styles.favoriteActive}`}
              onClick={() => handleRemoveFavorite(item.id, item.type)}
              title="Удалить из избранного"
            >
              ★
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites; 