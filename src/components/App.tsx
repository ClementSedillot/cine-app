import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Movies from '../pages/Movies';
import Landing from '../pages/Landing';
import Profile from '../pages/Profil';

const HelloWorld = () => <div>Hello World for unit test</div>;

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/helloWorld" element={<HelloWorld />} />
      </Routes>
    </Router>
  );
};

export default App;
