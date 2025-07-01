const { searchMovie, getMovieDetails, searchTVShow, getTVShowDetails } = require('../services/tmdb');

// Функция для обновления фильма
const updateMovie = async (movieTitle) => {
  try {
    // Поиск фильма в TMDB
    const searchResults = await searchMovie(movieTitle);
    if (!searchResults.results?.length) {
      throw new Error(`Фильм "${movieTitle}" не найден в TMDB`);
    }

    // Получение полных данных о фильме
    const movieDetails = await getMovieDetails(searchResults.results[0].id);
    
    // Трансформация данных в нужный формат
    const transformedData = {
      title: movieDetails.title,
      originalTitle: movieDetails.original_title,
      description: movieDetails.overview,
      year: new Date(movieDetails.release_date).getFullYear(),
      rating: movieDetails.vote_average,
      duration: movieDetails.runtime,
      ageRating: movieDetails.adult ? "18+" : "12+",
      poster: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`,
      genres: movieDetails.genres.map(g => g.name.toLowerCase()),
      director: movieDetails.credits?.crew.find(c => c.job === "Director")?.name || "Неизвестно",
      cast: movieDetails.credits?.cast.slice(0, 5).map(a => a.name) || [],
      trailerUrl: movieDetails.videos?.results[0]?.key 
        ? `https://www.youtube.com/watch?v=${movieDetails.videos.results[0].key}`
        : null
    };

    // Обновление в базе данных
    const response = await fetch(`http://localhost:3001/movies?title=${encodeURIComponent(movieTitle)}`);
    const existingMovies = await response.json();

    if (existingMovies.length > 0) {
      // Обновление существующего фильма
      const updateResponse = await fetch(`http://localhost:3001/movies/${existingMovies[0].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData)
      });
      return await updateResponse.json();
    } else {
      // Создание нового фильма
      const createResponse = await fetch('http://localhost:3001/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...transformedData, id: `mov${Date.now()}` })
      });
      return await createResponse.json();
    }
  } catch (error) {
    console.error(`Ошибка при обновлении фильма "${movieTitle}":`, error);
    throw error;
  }
};

// Функция для обновления сериала
const updateTVShow = async (showTitle) => {
  try {
    // Поиск сериала в TMDB
    const searchResults = await searchTVShow(showTitle);
    if (!searchResults.results?.length) {
      throw new Error(`Сериал "${showTitle}" не найден в TMDB`);
    }

    // Получение полных данных о сериале
    const showDetails = await getTVShowDetails(searchResults.results[0].id);
    
    // Трансформация данных
    const transformedData = {
      title: showDetails.name,
      originalTitle: showDetails.original_name,
      description: showDetails.overview,
      startYear: new Date(showDetails.first_air_date).getFullYear(),
      endYear: showDetails.status === "Ended" 
        ? new Date(showDetails.last_air_date).getFullYear() 
        : null,
      rating: showDetails.vote_average,
      ageRating: showDetails.adult ? "18+" : "16+",
      poster: `https://image.tmdb.org/t/p/w500${showDetails.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/original${showDetails.backdrop_path}`,
      genres: showDetails.genres.map(g => g.name.toLowerCase()),
      creator: showDetails.created_by.map(c => c.name).join(", ") || "Неизвестно",
      cast: showDetails.credits?.cast.slice(0, 5).map(a => a.name) || [],
      seasons: showDetails.seasons.map(season => ({
        number: season.season_number,
        episodes: season.episode_count,
        year: new Date(season.air_date).getFullYear()
      }))
    };

    // Обновление в базе данных
    const response = await fetch(`http://localhost:3001/series?title=${encodeURIComponent(showTitle)}`);
    const existingSeries = await response.json();

    if (existingSeries.length > 0) {
      // Обновление существующего сериала
      const updateResponse = await fetch(`http://localhost:3001/series/${existingSeries[0].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData)
      });
      return await updateResponse.json();
    } else {
      // Создание нового сериала
      const createResponse = await fetch('http://localhost:3001/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...transformedData, id: `ser${Date.now()}` })
      });
      return await createResponse.json();
    }
  } catch (error) {
    console.error(`Ошибка при обновлении сериала "${showTitle}":`, error);
    throw error;
  }
};

// Функция для обновления всего контента
const updateAllContent = async () => {
  const movies = [
    // Существующие фильмы
    "Начало",
    "Интерстеллар",
    "Властелин колец: Братство Кольца",
    "Матрица",
    "Гладиатор",
    // Новые фильмы
    "Побег из Шоушенка",
    "Форрест Гамп",
    "Зеленая миля",
    "Список Шиндлера",
    "Криминальное чтиво",
    "Темный рыцарь",
    "Бойцовский клуб",
    "Звёздные войны: Эпизод 4",
    "Властелин колец: Две крепости",
    "Властелин колец: Возвращение короля",
    "Матрица: Перезагрузка",
    "Матрица: Революция",
    "Назад в будущее",
    "Терминатор 2: Судный день",
    "Гладиатор 2",
    "Титаник",
    "Аватар",
    "Аватар: Путь воды",
    "Джокер",
    "Inception",
    "Престиж",
    "Остров проклятых",
    "Волк с Уолл-стрит",
    "Бесславные ублюдки",
    "Джанго освобожденный",
    "Однажды в Голливуде",
    "Операция Фортуна",
    "Топ Ган: Мэверик",
    "Миссия невыполнима: Смертельная расплата",
    "Барби",
    "Оппенгеймер",
    "Дюна",
    "Дюна: Часть вторая",
    "Безумный Макс: Дорога ярости",
    "1917",
    "Достать ножи",
    "Достать ножи: Стеклянная луковица",
    "Довод",
    "Веном",
    "Веном 2",
    "Человек-паук: Нет пути домой",
    "Стражи Галактики 3",
    "Мстители: Финал",
    "Железный человек",
    "Черная пантера",
    "Тор: Рагнарёк"
  ];

  const series = [
    "Игра престолов",
    "Очень странные дела",
    "Во все тяжкие",
    "Чернобыль",
    "Мандалорец",
    "Одни из нас",
    "Дом Дракона",
    "Черное зеркало",
    "Острые козырьки",
    "Ведьмак"
  ];

  console.log("Начинаем обновление базы данных...");

  try {
    // Обновляем фильмы
    console.log("Обновляем фильмы...");
    for (const movie of movies) {
      console.log(`Обновляем "${movie}"...`);
      await updateMovie(movie);
    }

    // Обновляем сериалы
    console.log("Обновляем сериалы...");
    for (const show of series) {
      console.log(`Обновляем "${show}"...`);
      await updateTVShow(show);
    }

    console.log("Обновление базы данных завершено!");
    return true;
  } catch (error) {
    console.error("Ошибка при обновлении базы данных:", error);
    throw error;
  }
};

module.exports = {
  updateMovie,
  updateTVShow,
  updateAllContent
}; 