import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import '../styles/Movies.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  favoriteMovies: Movie[];
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 // Checks if a user is logged in; if not, redirects to the login page
useEffect(() => {
  const userLoggedIn = localStorage.getItem('userLoggedIn');
  if (userLoggedIn) {
    const loggedInUser = JSON.parse(userLoggedIn);
    setUser(loggedInUser);
    setUsername(loggedInUser.username);
    setEmail(loggedInUser.email);
    setPassword(loggedInUser.password);
  } else {
    navigate('/login');
  }
}, [navigate]);

// Saves the updated profile information to local storage and alerts the user of success
const handleSaveProfile = () => {
  if (user) {
    const updatedUser: User = {
      ...user,
      username,
      email,
      password,
    };
    setUser(updatedUser);
    localStorage.setItem('userLoggedIn', JSON.stringify(updatedUser));
    alert('Profile updated successfully!');
  }
};

// Removes a movie from the user's list of favorite movies and updates local storage
const handleRemoveFavorite = (movieId: number) => {
  if (user) {
    const updatedFavorites = user.favoriteMovies.filter((movie) => movie.id !== movieId);
    const updatedUser: User = { ...user, favoriteMovies: updatedFavorites };
    setUser(updatedUser);
    localStorage.setItem('userLoggedIn', JSON.stringify(updatedUser));
  }
};

  return (
    <div className="profile-page">
        <div className="favorites-list">
        <h3>Films Favoris</h3>
        {user?.favoriteMovies.length ? (
          <div className="favorites-grid">
            {user.favoriteMovies.map((movie) => (
              <div key={movie.id} className="favorite-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="favorite-poster"
                />
                <h4 className="favorite-title">{movie.title}</h4>
                <button
                  className="btn btn-danger remove-favorite"
                  onClick={() => handleRemoveFavorite(movie.id)}
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun film favori pour le moment.</p>
        )}
      </div>
      <h2 className="profile-title">Profil de {user?.username}</h2>

      <div className="profile-form">
        <h3>Éditer le profil</h3>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-success" onClick={handleSaveProfile}>
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default Profile;
