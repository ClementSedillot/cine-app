import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login: React.FC = () => {
  // Manages form input states for email and password, as well as any error message that might be displayed
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Handles the login form submission
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Retrieves all users from local storage, filtering keys that match 'user_' prefix
    const users = Object.keys(localStorage)
      .filter((key) => key.startsWith('user_'))
      .map((key) => JSON.parse(localStorage.getItem(key) || '{}'));

    // Finds a user whose email and password match the input values
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      // Stores the logged-in user in local storage and navigates to the movies page
      localStorage.setItem('userLoggedIn', JSON.stringify(user));
      navigate('/movies');
    } else {
      // Displays an error message if the email or password are incorrect
      setErrorMessage('Email ou mot de passe incorrect.');
    }
  };

  // JSX structure for the login form and its fields
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

        {/* Displays the error message if login credentials are incorrect */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="login-btn">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
