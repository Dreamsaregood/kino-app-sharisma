import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovies } from '../context/MoviesContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import styles from './MovieDetails.module.css';

function MovieDetails() {
  const { id } = useParams();
  const { getMovieById } = useMovies();
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [movie, setMovie] = useState(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      const data = await getMovieById(id);
      setMovie(data);
      setLoading(false);
    };
    fetchMovie();
  }, [id, getMovieById]);

  useEffect(() => {
    if (user && id) {
      setIsFav(isFavorite(id, 'movie'));
    }
  }, [user, id, isFavorite]);

  const handleToggleFavorite = async () => {
    if (!user) return;

    try {
      if (isFav) {
        const success = await removeFromFavorites(id, 'movie');
        if (success) setIsFav(false);
      } else {
        const success = await addToFavorites(id, 'movie');
        if (success) setIsFav(true);
      }
    } catch (error) {
      console.error('Ошибка при обработке избранного:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!movie) {
    return <div className={styles.error}>Фильм не найден</div>;
  }

  return (
    <div className={styles.movieBg}>
      {/* Cinematic Hero Section */}
      <div 
        className={styles.cinematicHero}
        style={{
          backgroundImage: `url(${movie.backdrop})`,
        }}
      >
        <div className={styles.heroGradient}>
          <div className={styles.heroContent}>
            <div className={styles.movieMeta}>
              <span className={styles.rating}>{movie.rating} ★</span>
              <span className={styles.year}>{movie.year}</span>
              {movie.ageRating && (
                <span className={styles.age}>{movie.ageRating}</span>
              )}
            </div>
            <h1 className={styles.movieTitle}>{movie.title}</h1>
            {movie.originalTitle && (
              <span className={styles.originalTitle}>{movie.originalTitle}</span>
            )}
            <div className={styles.movieTags}>
              {movie.genres?.map((genre, index) => (
                <span key={index}>{genre}</span>
              ))}
            </div>
            <div className={styles.actionButtons}>
              <button 
                className={styles.playButton}
                onClick={() => setIsTrailerPlaying(true)}
              >
                ▶ Смотреть фильм
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
      </div>

      {/* Content Section */}
      <div className={styles.contentWrapper}>
        <div className={styles.posterSection}>
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className={styles.posterImage}
          />
          <div className={styles.ratingCard}>
            <div className={styles.ratingScore}>
              <span className={styles.scoreNumber}>{movie.rating}</span>
              <span className={styles.scoreLabel}>Рейтинг</span>
            </div>
            <div className={styles.ratingButtons}>
              <button className={styles.likeBtn}>👍</button>
              <button className={styles.dislikeBtn}>👎</button>
            </div>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.description}>
            {movie.description}
          </div>
          <div className={styles.metaInfo}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Режиссёр</span>
              <span className={styles.metaValue}>{movie.director || 'Н/Д'}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Страна</span>
              <span className={styles.metaValue}>{movie.country || 'Н/Д'}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Длительность</span>
              <span className={styles.metaValue}>{movie.duration || 'Н/Д'} мин.</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Премьера</span>
              <span className={styles.metaValue}>{movie.releaseDate || 'Н/Д'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {isTrailerPlaying && (
        <div 
          className={styles.trailerModal}
          onClick={() => setIsTrailerPlaying(false)}
        >
          <div className={styles.trailerWrapper}>
            <button 
              className={styles.closeTrailer}
              onClick={() => setIsTrailerPlaying(false)}
            >
              ✕
            </button>
            <iframe
              src={movie.trailerUrl}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails; 