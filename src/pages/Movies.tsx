import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Movies.css';

const API_KEY = '7c6ba241ae896589000f37feed1efef7';
const MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn) {
      const user = JSON.parse(userLoggedIn);
      setIsLoggedIn(true);
      setUsername(user.username);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(MOVIES_URL)
        .then((response) => {
          setMovies(response.data.results);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des films :", error);
        });
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/login');
  };

  return (
    <div className="movies-container">
      {/* Afficher le message de bienvenue */}
      {isLoggedIn && <h1 className="welcome-message">Hello, {username} !</h1>}
      <button className="btn-danger logout-button" onClick={handleLogout}>
        Déconnexion
      </button>
      <h2 className='movies-title'>Films Populaires</h2>
      
      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h2 className="movie-title">{movie.title}</h2>
            <p className="movie-overview">{movie.overview}</p>
            <p className="movie-release-date">Sortie : {movie.release_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;

