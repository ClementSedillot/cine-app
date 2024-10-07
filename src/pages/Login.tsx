import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Gestion de la soumission du formulaire
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Parcourir les utilisateurs enregistrés dans le localStorage
    const users = Object.keys(localStorage)
      .filter((key) => key.startsWith('user_'))
      .map((key) => JSON.parse(localStorage.getItem(key) || '{}'));

    // Vérifier si un utilisateur correspond à l'email et au mot de passe
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      // Si l'utilisateur est trouvé, sauvegarder dans localStorage et rediriger
      localStorage.setItem('userLoggedIn', JSON.stringify(user));
      navigate('/movies');
    } else {
      // Si les informations ne correspondent pas, afficher un message d'erreur
      setErrorMessage('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="login-btn">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
