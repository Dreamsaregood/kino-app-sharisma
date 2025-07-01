import { createContext, useContext, useState, useEffect } from 'react';

const MoviesContext = createContext();

export function useMovies() {
  return useContext(MoviesContext);
}

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchMovies(), fetchSeries(), fetchGenres()])
      .then(() => setLoading(false))
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:3001/movies');
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err);
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await fetch('http://localhost:3001/series');
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Series data is not an array:', data);
        setSeries([]);
        return;
      }
      setSeries(data);
    } catch (err) {
      console.error('Error fetching series:', err);
      setError(err);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:3001/genres');
      const data = await response.json();
      setGenres(data);
    } catch (err) {
      setError(err);
    }
  };

  const filterValidContent = (items) => {
    if (!Array.isArray(items)) return [];
    return items.filter(item => 
      item && 
      item.title && 
      item.description && 
      item.poster && 
      item.poster.startsWith('http') &&
      item.backdrop && 
      item.backdrop.startsWith('http')
    );
  };

  const getTopRatedMovies = () => {
    const validMovies = filterValidContent(movies);
    return validMovies
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  };

  const getTopRatedSeries = () => {
    const validSeries = filterValidContent(series);
    return validSeries
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  };

  const getLatestMovies = () => {
    const validMovies = filterValidContent(movies);
    return validMovies
      .sort((a, b) => {
        const dateA = new Date(a.releaseDate || a.year);
        const dateB = new Date(b.releaseDate || b.year);
        return dateB - dateA;
      })
      .slice(0, 10);
  };

  const getLatestSeries = () => {
    const validSeries = filterValidContent(series);
    return validSeries
      .sort((a, b) => {
        const yearA = parseInt(a.startYear);
        const yearB = parseInt(b.startYear);
        return yearB - yearA;
      })
      .slice(0, 8);
  };

  const getMovieById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/movies/${id}`);
      const movie = await response.json();
      return movie;
    } catch (err) {
      setError(err);
      return null;
    }
  };

  const getSeriesById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/series/${id}`);
      if (!response.ok) {
        throw new Error('Сериал не найден');
      }
      const series = await response.json();
      if (!series) {
        throw new Error('Сериал не найден');
      }
      return series;
    } catch (err) {
      console.error('Error fetching series:', err);
      throw err;
    }
  };

  const searchContent = (query) => {
    const searchRegex = new RegExp(query, 'i');
    const filteredMovies = movies.filter(movie => 
      searchRegex.test(movie.title) || searchRegex.test(movie.originalTitle)
    );
    const filteredSeries = series.filter(series => 
      searchRegex.test(series.title) || searchRegex.test(series.originalTitle)
    );
    return { movies: filteredMovies, series: filteredSeries };
  };

  const filterByGenre = (genreName) => {
    const filteredMovies = movies.filter(movie => 
      movie.genres && movie.genres.includes(genreName)
    );
    const filteredSeries = series.filter(series => 
      series.genres && series.genres.includes(genreName)
    );
    return { movies: filteredMovies, series: filteredSeries };
  };

  const value = {
    movies,
    series,
    genres,
    loading,
    error,
    getMovieById,
    getSeriesById,
    searchContent,
    filterByGenre,
    getLatestMovies,
    getLatestSeries,
    getTopRatedMovies,
    getTopRatedSeries
  };

  return (
    <MoviesContext.Provider value={value}>
      {children}
    </MoviesContext.Provider>
  );
} 