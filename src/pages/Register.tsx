import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Register: React.FC = () => {
  // États pour les champs de formulaire
  const [id, setId] = useState(1); // Initialisation avec 1 par défaut
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // Calculer l'ID automatiquement en fonction des utilisateurs existants
  useEffect(() => {
    const users = Object.keys(localStorage)
      .filter((key) => key.startsWith('user_'))
      .map((key) => JSON.parse(localStorage.getItem(key) || '{}'));

    // Récupérer l'ID le plus élevé parmi les utilisateurs enregistrés
    const lastId = users.length > 0 ? Math.max(...users.map((user) => parseInt(user.id))) : 0;

    // Définir le nouvel ID auto-incrémenté
    setId(lastId + 1);
  }, []);

  // Gestion de la soumission du formulaire
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Création de l'objet utilisateur
    const newUser = {
      id: id.toString(),
      username,
      email,
      password,
    };

    // Enregistrement de l'utilisateur dans le localStorage
    localStorage.setItem('user_' + newUser.id, JSON.stringify(newUser));

    // Réinitialiser le formulaire
    setUsername('');
    setEmail('');
    setPassword('');

    // Rediriger l'utilisateur vers la page de connexion
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
