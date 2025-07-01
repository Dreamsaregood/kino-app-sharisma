import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MoviesContext';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const { user, logout } = useAuth();
  const { searchContent } = useMovies();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      setIsSearching(true);
      const results = await searchContent(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults(null);
    }
  };

  const handleResultClick = (type, id) => {
    setSearchResults(null);
    setSearchQuery('');
    navigate(`/${type}/${id}`);
  };

  return (
    <header className={styles.headerBg}>
      <div className={styles.headerTop}>
        <NavLink to="/" className={styles.logo}>SHARISMA</NavLink>
        <div className={styles.search}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Фильмы, сериалы, телевидение"
            className={styles.searchInput}
          />
          {searchResults && (
            <div className={styles.searchResults}>
              {isSearching ? (
                <div className={styles.searchLoading}>Поиск...</div>
              ) : (
                <>
                  {searchResults.movies.length > 0 && (
                    <div className={styles.resultSection}>
                      <h3 className={styles.resultTitle}>Фильмы</h3>
                      {searchResults.movies.map(movie => (
                        <div
                          key={movie.id}
                          className={styles.resultItem}
                          onClick={() => handleResultClick('movie', movie.id)}
                        >
                          <span className={styles.resultName}>{movie.title}</span>
                          <span className={styles.resultYear}>{movie.year}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.series.length > 0 && (
                    <div className={styles.resultSection}>
                      <h3 className={styles.resultTitle}>Сериалы</h3>
                      {searchResults.series.map(series => (
                        <div
                          key={series.id}
                          className={styles.resultItem}
                          onClick={() => handleResultClick('series', series.id)}
                        >
                          <span className={styles.resultName}>{series.title}</span>
                          <span className={styles.resultYear}>{series.startYear}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.movies.length === 0 && searchResults.series.length === 0 && (
                    <div className={styles.noResults}>
                      Ничего не найдено
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        {user ? (
          <div className={styles.userMenu}>
            <button 
              onClick={() => navigate('/gift-subscription')} 
              className={styles.giftBtn}
            >
              <span style={{fontSize: '1.2em'}}>🎁</span> Подарить подписку
            </button>
            <NavLink to="/account" className={styles.accountBtn}>
              <div className={styles.userAvatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name[0]}</span>
                )}
              </div>
              <span className={styles.userName}>{user.name}</span>
            </NavLink>
          </div>
        ) : (
          <NavLink to="/login" className={styles.loginBtn}>
            <span style={{fontSize: '1.2em'}}>👤</span> Войти
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Header;