import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Movies.css';

const Movies: React.FC = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userLoggedIn = localStorage.getItem('userLoggedIn');

    if (userLoggedIn) {
      // Si connecté, récupérer le nom d'utilisateur
      const user = JSON.parse(userLoggedIn);
      setUsername(user.username);
    } else {
      // Si non connecté, rediriger vers la page de connexion
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="movies-container">
      {username ? (
        <h1>Hello, {username} !</h1>
      ) : (
        <div>
          <h1>Vous n'êtes pas connecté.</h1>
          <p>
            Veuillez vous <Link to="/login">connecter</Link>.
          </p>
        </div>
      )}
    </div>
  );
};

export default Movies;
