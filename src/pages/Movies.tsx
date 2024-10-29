import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/Movies.css';

const API_KEY = '7c6ba241ae896589000f37feed1efef7';
const MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`;
const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=fr-FR`;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  original_language: string;
}

interface Genre {
  id: number;
  name: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  favoriteMovies: Movie[];
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('searchTerm') || '');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | 'all'>(localStorage.getItem('selectedGenre') ? parseInt(localStorage.getItem('selectedGenre') || '0') : 'all');
  const [selectedYear, setSelectedYear] = useState<string | 'all'>(localStorage.getItem('selectedYear') || 'all');
  const [selectedLanguage, setSelectedLanguage] = useState<string | 'all'>(localStorage.getItem('selectedLanguage') || 'all');
  const navigate = useNavigate();

  // Checks if a user is logged in; if not, redirects to the login page
useEffect(() => {
  const userLoggedIn = localStorage.getItem('userLoggedIn');
  if (userLoggedIn) {
    const loggedInUser = JSON.parse(userLoggedIn);
    const updatedUser = { ...loggedInUser, favoriteMovies: loggedInUser.favoriteMovies || [] };
    setIsLoggedIn(true);
    setUsername(loggedInUser.username);
    setUser(updatedUser);
  } else {
    navigate('/login');
  }
}, [navigate]);

// Fetches popular movies from the API and applies stored filters if a user is logged in
useEffect(() => {
  if (isLoggedIn) {
    axios
      .get(MOVIES_URL)
      .then((response) => {
        setMovies(response.data.results);
        setFilteredMovies(response.data.results);
        applyStoredFilters(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }
}, [isLoggedIn]);

// Fetches movie genres from the API
useEffect(() => {
  axios
    .get(GENRES_URL)
    .then((response) => {
      setGenres(response.data.genres);
    })
    .catch((error) => {
      console.error("Error fetching genres:", error);
    });
}, []);

// Applies stored filters for search, genre, year, and language on the movie list
const applyStoredFilters = (movies: Movie[]) => {
  filterMovies(searchTerm, selectedGenre, selectedYear, selectedLanguage, movies);
};

// Logs the user out and redirects to the login page
const handleLogout = () => {
  localStorage.removeItem('userLoggedIn');
  navigate('/login');
};

// Opens the modal for a specific movie and fetches its trailer
const handleShowModal = (movie: Movie) => {
  setSelectedMovie(movie);
  setShowModal(true);
  fetchTrailer(movie.id);
};

// Closes the movie modal and clears trailer data
const handleCloseModal = () => {
  setShowModal(false);
  setSelectedMovie(null);
  setTrailerKey(null);
};

// Fetches the trailer for a movie based on its ID
const fetchTrailer = async (movieId: number) => {
  const TRAILER_URL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;
  try {
    const response = await axios.get(TRAILER_URL);
    const videos = response.data.results;
    const trailer = videos.find((video: any) => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailer) {
      setTrailerKey(trailer.key);
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
  }
};

// Adds a movie to the user's favorites
const addToFavorites = (movie: Movie) => {
  if (user) {
    const updatedUser = {
      ...user,
      favoriteMovies: user.favoriteMovies ? [...user.favoriteMovies, movie] : [movie]
    };
    setUser(updatedUser);
    localStorage.setItem('userLoggedIn', JSON.stringify(updatedUser));
  }
};

// Removes a movie from the user's favorites
const removeFromFavorites = (movie: Movie) => {
  if (user) {
    const updatedUser = {
      ...user,
      favoriteMovies: user.favoriteMovies.filter(favMovie => favMovie.id !== movie.id)
    };
    setUser(updatedUser);
    localStorage.setItem('userLoggedIn', JSON.stringify(updatedUser));
  }
};

// Checks if a movie is in the user's favorites
const isFavorite = (movie: Movie): boolean => {
  return user?.favoriteMovies.some(favMovie => favMovie.id === movie.id) || false;
};

// Updates the search term and filters movies accordingly
const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchTerm(value);
  localStorage.setItem('searchTerm', value);
  filterMovies(value, selectedGenre, selectedYear, selectedLanguage);
};

// Updates the selected genre and filters movies accordingly
const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const genreId = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
  setSelectedGenre(genreId);
  localStorage.setItem('selectedGenre', genreId.toString());
  filterMovies(searchTerm, genreId, selectedYear, selectedLanguage);
};

// Updates the selected year and filters movies accordingly
const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const year = e.target.value;
  setSelectedYear(year);
  localStorage.setItem('selectedYear', year);
  filterMovies(searchTerm, selectedGenre, year, selectedLanguage);
};

// Updates the selected language and filters movies accordingly
const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const language = e.target.value;
  setSelectedLanguage(language);
  localStorage.setItem('selectedLanguage', language);
  filterMovies(searchTerm, selectedGenre, selectedYear, language);
};

// Filters movies by search term, genre, year, and language
const filterMovies = (search: string, genreId: number | 'all', year: string | 'all', language: string, sourceMovies = movies) => {
  let filtered = sourceMovies;
  if (search) {
    filtered = filtered.filter((movie) => movie.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (genreId !== 'all') {
    filtered = filtered.filter((movie) => movie.genre_ids.includes(genreId));
  }
  if (year !== 'all') {
    filtered = filtered.filter((movie) => movie.release_date.startsWith(year));
  }
  if (language !== 'all') {
    filtered = filtered.filter((movie) => movie.original_language === language);
  }
  setFilteredMovies(filtered);
};

// Resets all filters and clears local storage
const resetFilters = () => {
  setSearchTerm('');
  setSelectedGenre('all');
  setSelectedYear('all');
  setSelectedLanguage('all');
  setFilteredMovies(movies);
  localStorage.removeItem('searchTerm');
  localStorage.removeItem('selectedGenre');
  localStorage.removeItem('selectedYear');
  localStorage.removeItem('selectedLanguage');
};


  return (
    <div className="movies-page">
      <nav className="navbar">
        <div className="navbar-brand">CineApp</div>
        <div className="nav-links">
          <span className="welcome-message">Hello, {username}!</span>
          <Link to="/profile" className="btn btn-primary">Profil</Link>
          <button className="btn btn-danger" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="movies-container">
        <h2 className="movies-title">Films Populaires</h2>

        <div className="filters">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Rechercher un film..."
            className="search-bar"
          />

          <select value={selectedGenre} onChange={handleGenreChange} className="genre-select">
            <option value="all">Toutes les catégories</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>

          <select value={selectedYear} onChange={handleYearChange} className="year-select">
            <option value="all">Toutes les années</option>
            {Array.from(new Set(movies.map(movie => movie.release_date.split('-')[0]))).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select value={selectedLanguage} onChange={handleLanguageChange} className="genre-select">
            <option value="all">Toutes les langues</option>
            {Array.from(new Set(movies.map(movie => movie.original_language))).map(language => (
              <option key={language} value={language}>{language.toUpperCase()}</option>
            ))}
          </select>

          <button onClick={resetFilters} className="btn btn-secondary reset-button">
            Réinitialiser
          </button>
        </div>

        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="movie-poster" />
              <h2 className="movie-title">{movie.title}</h2>
              <button className={`heart-button ${isFavorite(movie) ? 'in-favorites' : ''}`}
                onClick={() => isFavorite(movie) ? removeFromFavorites(movie) : addToFavorites(movie)}
                title={isFavorite(movie) ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                <FontAwesomeIcon icon={faHeart} className={`heart-icon ${isFavorite(movie) ? 'favorite' : ''}`} />
                <FontAwesomeIcon icon={faTrash} className={`trash-icon ${isFavorite(movie) ? 'show-on-hover' : ''}`} />
              </button>
              <button className="btn btn-primary" onClick={() => handleShowModal(movie)}>Voir la description</button>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedMovie && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={handleCloseModal}>&times;</span>
            <h2>{selectedMovie.title}</h2>
            {trailerKey ? (
              <YouTube videoId={trailerKey} className="trailer-video" opts={{ height: '390', width: '640', playerVars: { autoplay: 1, mute: 0 } }} />
            ) : <p>Aucune bande-annonce disponible.</p>}
            <p><strong>Description:</strong> {selectedMovie.overview}</p>
            <p><strong>Date de sortie:</strong> {selectedMovie.release_date}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
