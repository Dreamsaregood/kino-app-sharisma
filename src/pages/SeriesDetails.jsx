import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMovies } from '../context/MoviesContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import styles from './SeriesDetails.module.css';

function SeriesDetails() {
  const { id } = useParams();
  const { getSeriesById } = useMovies();
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getSeriesById(id);
        setSeries(data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке сериала:', error);
        setLoading(false);
      }
    };

    fetchSeries();
  }, [id, getSeriesById]);

  useEffect(() => {
    if (user && id) {
      setIsFav(isFavorite(id, 'series'));
    }
  }, [user, id, isFavorite]);

  const handleToggleFavorite = async () => {
    if (!user) return;

    try {
      if (isFav) {
        const success = await removeFromFavorites(id, 'series');
        if (success) setIsFav(false);
      } else {
        const success = await addToFavorites(id, 'series');
        if (success) setIsFav(true);
      }
    } catch (error) {
      console.error('Ошибка при обработке избранного:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!series) {
    return <div className={styles.error}>Сериал не найден</div>;
  }

  return (
    <div className={styles.seriesBg}>
      {/* Hero Section */}
      <div 
        className={styles.heroSection}
        style={{
          backgroundImage: `url(${series.backdrop})`
        }}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>
            {series.rating && (
              <span className={styles.rating}>{series.rating} ★</span>
            )}
            {series.year && (
              <span className={styles.year}>{series.year}</span>
            )}
            {series.ageRating && (
              <span className={styles.ageRating}>{series.ageRating}+</span>
            )}
          </div>

          <h1 className={styles.heroTitle}>
            {series.title}
            {series.originalTitle && (
              <span className={styles.originalTitle}>{series.originalTitle}</span>
            )}
          </h1>

          {series.genres && (
            <div className={styles.genres}>
              {series.genres.map((genre, index) => (
                <span key={index} className={styles.genre}>{genre}</span>
              ))}
            </div>
          )}

          <div className={styles.description}>
            {series.description}
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.watchButton}>
              ▶ Смотреть сериал
            </button>
            <button className={styles.trailerButton}>
              Трейлер
            </button>
            {user && (
              <button 
                className={`${styles.favoriteButton} ${isFav ? styles.favoriteActive : ''}`}
                onClick={handleToggleFavorite}
                title={isFav ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                {isFav ? '★' : '☆'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <nav className={styles.tabsNav}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'about' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('about')}
          >
            О сериале
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'episodes' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('episodes')}
          >
            Эпизоды
          </button>
        </nav>

        <div className={styles.tabContent}>
          {activeTab === 'about' && (
            <div className={styles.aboutSection}>
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoTitle}>Информация</h3>
                  <div className={styles.infoRows}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Режиссёр</span>
                      <span className={styles.infoValue}>{series.director || 'Н/Д'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Страна</span>
                      <span className={styles.infoValue}>{series.country || 'Н/Д'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Количество сезонов</span>
                      <span className={styles.infoValue}>{series.seasons?.length || 'Н/Д'}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Премьера</span>
                      <span className={styles.infoValue}>{series.releaseDate || 'Н/Д'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'episodes' && (
            <div className={styles.episodesSection}>
              <div className={styles.seasonSelector}>
                {series.seasons?.map((season, index) => (
                  <button
                    key={index}
                    className={`${styles.seasonBtn} ${selectedSeason === season.number ? styles.seasonActive : ''}`}
                    onClick={() => setSelectedSeason(season.number)}
                  >
                    Сезон {season.number}
                  </button>
                ))}
              </div>
              
              <div className={styles.episodesList}>
                {series.seasons?.find(s => s.number === selectedSeason)?.episodes.map((episode, index) => (
                  <div key={index} className={styles.episodeCard}>
                    <div className={styles.episodeNumber}>
                      Эпизод {episode.number}
                    </div>
                    <div className={styles.episodeInfo}>
                      <h3 className={styles.episodeTitle}>{episode.title}</h3>
                      <p className={styles.episodeDescription}>{episode.description}</p>
                    </div>
                    <button className={styles.playBtn}>▶</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeriesDetails; 