import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MoviesProvider } from './context/MoviesContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Subscribe from './pages/Subscribe';
import GiftSubscription from './pages/GiftSubscription';
import MovieDetails from './pages/MovieDetails';
import SeriesDetails from './pages/SeriesDetails';
import Series from './pages/Series';
import TV from './pages/TV';
import Account from './pages/Account';
import Favorites from './pages/Favorites';

function App() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <FavoritesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/series/:id" element={<SeriesDetails />} />
              <Route path="/series" element={<Series />} />
              <Route path="/tv" element={<TV />} />
              <Route path="/account" element={<Account />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/gift-subscription" element={<GiftSubscription />} />
          </Routes>
        </FavoritesProvider>
      </MoviesProvider>
    </AuthProvider>
  );
}

export default App;