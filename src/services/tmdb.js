const { TMDB_API_KEY, TMDB_BASE_URL, getImageUrl } = require('../config/api');

// Базовые параметры для запросов
const defaultParams = {
  api_key: TMDB_API_KEY,
  language: 'ru-RU',
  append_to_response: 'credits,videos'
};

// Функция для выполнения запросов к API
const fetchFromTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  const searchParams = new URLSearchParams({
    ...defaultParams,
    ...params
  });
  url.search = searchParams.toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }
  return response.json();
};

// Поиск фильма
const searchMovie = async (query) => {
  return fetchFromTMDB('/search/movie', { query });
};

// Получение деталей фильма
const getMovieDetails = async (movieId) => {
  return fetchFromTMDB(`/movie/${movieId}`);
};

// Поиск сериала
const searchTVShow = async (query) => {
  return fetchFromTMDB('/search/tv', { query });
};

// Получение деталей сериала
const getTVShowDetails = async (tvId) => {
  return fetchFromTMDB(`/tv/${tvId}`);
};

// Преобразование данных фильма из TMDB в формат вашей базы данных
const transformMovieData = (tmdbMovie) => {
  return {
    title: tmdbMovie.title,
    originalTitle: tmdbMovie.original_title,
    description: tmdbMovie.overview,
    year: new Date(tmdbMovie.release_date).getFullYear(),
    rating: tmdbMovie.vote_average,
    duration: tmdbMovie.runtime,
    ageRating: 'PG-13', // Нужно настроить маппинг
    poster: getImageUrl(tmdbMovie.poster_path, 'w500'),
    backdrop: getImageUrl(tmdbMovie.backdrop_path, 'original'),
    genres: tmdbMovie.genres.map(g => g.name.toLowerCase()),
    director: tmdbMovie.credits?.crew.find(c => c.job === 'Director')?.name || '',
    cast: tmdbMovie.credits?.cast.slice(0, 5).map(c => c.name) || [],
    trailerUrl: tmdbMovie.videos?.results[0]?.key 
      ? `https://www.youtube.com/watch?v=${tmdbMovie.videos.results[0].key}`
      : null
  };
};

// Преобразование данных сериала из TMDB в формат вашей базы данных
const transformTVShowData = (tmdbShow) => {
  return {
    title: tmdbShow.name,
    originalTitle: tmdbShow.original_name,
    description: tmdbShow.overview,
    startYear: new Date(tmdbShow.first_air_date).getFullYear(),
    endYear: tmdbShow.status === 'Ended' 
      ? new Date(tmdbShow.last_air_date).getFullYear() 
      : null,
    rating: tmdbShow.vote_average,
    ageRating: 'PG-13', // Нужно настроить маппинг
    poster: getImageUrl(tmdbShow.poster_path, 'w500'),
    backdrop: getImageUrl(tmdbShow.backdrop_path, 'original'),
    genres: tmdbShow.genres.map(g => g.name.toLowerCase()),
    creator: tmdbShow.created_by.map(c => c.name).join(', '),
    cast: tmdbShow.credits?.cast.slice(0, 5).map(c => c.name) || [],
    seasons: tmdbShow.seasons.map(season => ({
      number: season.season_number,
      episodes: season.episode_count,
      year: new Date(season.air_date).getFullYear()
    }))
  };
};

module.exports = {
  searchMovie,
  getMovieDetails,
  searchTVShow,
  getTVShowDetails,
  transformMovieData,
  transformTVShowData
}; 