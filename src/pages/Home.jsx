import { Link } from 'react-router-dom';
import { useMovies } from '../context/MoviesContext';
import styles from './Home.module.css';

function Home() {
  const {
    getLatestMovies,
    getTopRatedMovies,
    loading
  } = useMovies();

  const latestMovies = getLatestMovies();
  const topRatedMovies = getTopRatedMovies();

  // Выбираем фильм для баннера (берем первый из топ рейтинга)
  const featuredMovie = topRatedMovies?.[0] || {
    id: "mov1",
    title: "Дюна",
    originalTitle: "Dune",
    description: "Наследник знаменитого дома Атрейдесов Пол отправляется вместе с семьей на одну из самых опасных планет во Вселенной — Арракис. Здесь нет ничего, кроме песка, палящего солнца, гигантских чудовищ и основной причины межгалактических конфликтов — невероятно ценного ресурса, который называется меланж.",
    rating: 8.4,
    ageRating: "13",
    backdrop: "https://image.tmdb.org/t/p/original/8BCLQmxUh5ZGLs0LhUqUaSuKcXR.jpg"
  };

  const ContentRow = ({ title, items }) => {
    if (!items?.length) return null;

    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.row}>
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/movie/${item.id}`}
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
                <div className={styles.cardBadge}>
                  {item.rating}
                </div>
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
    <div className={styles.moviesBg}>
      {featuredMovie && (
        <section 
          className={styles.heroSection} 
          style={{
            backgroundImage: `url(${featuredMovie.backdrop})`,
            backgroundPosition: '50% 35%'
          }}
        >
          <div className={styles.heroContent}>
            <div className={styles.heroMeta}>
              <span className={styles.newLabel}>Рекомендуем</span>
              <span className={styles.rating}>{featuredMovie.rating} ★</span>
              {featuredMovie.ageRating && (
                <span className={styles.ageRating}>{featuredMovie.ageRating}+</span>
              )}
            </div>
            <div className={styles.heroTitleWrapper}>
              <h1 className={styles.heroTitle}>
                {featuredMovie.title}
              </h1>
              <span className={styles.originalTitle}>{featuredMovie.originalTitle}</span>
            </div>
            <p className={styles.heroDesc}>{featuredMovie.description}</p>
            <div className={styles.heroBtns}>
              <Link to={`/movie/${featuredMovie.id}`} className={styles.watchBtn}>
                Смотреть фильм
              </Link>
              <Link to={`/movie/${featuredMovie.id}`} className={styles.detailsBtn}>
                Подробнее
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <div className={styles.container}>
        {topRatedMovies?.length > 0 && (
          <ContentRow
            title="Лучшие фильмы"
            items={topRatedMovies}
          />
        )}
        {latestMovies?.length > 0 && (
          <ContentRow
            title="Новые фильмы"
            items={latestMovies}
          />
        )}
      </div>
    </div>
  );
}

export default Home;