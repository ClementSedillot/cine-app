import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register: React.FC = () => {
  const [id, setId] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

 
  // Initializes the next available user ID by checking local storage for existing users
useEffect(() => {
  const users = Object.keys(localStorage)
    .filter((key) => key.startsWith('user_'))
    .map((key) => JSON.parse(localStorage.getItem(key) || '{}'));

  const lastId = users.length > 0 ? Math.max(...users.map((user) => parseInt(user.id))) : 0;
  setId(lastId + 1);
}, []);

// Handles form submission to register a new user
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  // Creates a new user object and saves it to local storage
  const newUser = {
    id: id.toString(),
    username,
    email,
    password,
  };

  localStorage.setItem('user_' + newUser.id, JSON.stringify(newUser));

  // Resets form fields after successful registration and redirects to login
  setUsername('');
  setEmail('');
  setPassword('');
  navigate('/login');
};

  return (
    <div className="register-container">
      <h2>Créer un compte</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

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

        <button type="submit" className="register-btn">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
