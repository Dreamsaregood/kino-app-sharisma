import { Link } from 'react-router-dom';
import { useMovies } from '../context/MoviesContext';
import styles from './Series.module.css';

function Series() {
  const {
    getLatestSeries,
    getTopRatedSeries,
    loading
  } = useMovies();

  const latestSeries = getLatestSeries();
  const topRatedSeries = getTopRatedSeries();
  const featuredSeries = {
    id: "ser6",
    title: "Последние из нас",
    originalTitle: "The Last of Us",
    description: "Через двадцать лет после гибели современной цивилизации Джоэл, опытный выживший, должен сопровождать 14-летнюю Элли через постапокалиптические США.",
    rating: 8.8,
    ageRating: "18",
    backdrop: "https://image.tmdb.org/t/p/original/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg"
  };

  const ContentRow = ({ title, items }) => {
    if (!items?.length) return null;

    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.row}>
          {items.map((item) => (
            <Link 
              to={`/series/${item.id}`}
              key={item.id} 
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <img 
                  src={item.poster} 
                  alt={item.title} 
                  className={styles.poster}
                  loading="lazy"
                />
                <div className={styles.cardOverlay}>
                  <div className={styles.cardContent}>
                    <p className={styles.cardDescription}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                {item.rating && (
                  <div className={styles.cardBadge}>
                    {item.rating}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.seriesBg}>
      {featuredSeries && (
        <section 
          className={styles.heroSection} 
          style={{
            backgroundImage: `url(${featuredSeries.backdrop})`,
            backgroundPosition: '50% 35%'
          }}
        >
          <div className={styles.heroContent}>
            <div className={styles.heroMeta}>
              <span className={styles.newEpisodeLabel}>Новый сериал</span>
              <span className={styles.rating}>{featuredSeries.rating} ★</span>
              {featuredSeries.ageRating && (
                <span className={styles.ageRating}>{featuredSeries.ageRating}+</span>
              )}
            </div>
            <div className={styles.heroTitleWrapper}>
              <h1 className={styles.heroTitle}>
                {featuredSeries.title}
              </h1>
              <span className={styles.originalTitle}>{featuredSeries.originalTitle}</span>
            </div>
            <p className={styles.heroDesc}>{featuredSeries.description}</p>
            <div className={styles.heroBtns}>
              <Link to={`/series/${featuredSeries.id}`} className={styles.watchBtn}>
                Смотреть сериал
              </Link>
              <Link to={`/series/${featuredSeries.id}`} className={styles.detailsBtn}>
                Подробнее
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <div className={styles.container}>
        {topRatedSeries?.length > 0 && (
          <ContentRow
            title="Лучшие сериалы"
            items={topRatedSeries}
          />
        )}
        {latestSeries?.length > 0 && (
          <ContentRow
            title="Новые сериалы"
            items={latestSeries}
          />
        )}
      </div>
    </div>
  );
}

export default Series; 