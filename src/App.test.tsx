import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './components/App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeText = screen.getByText(/Bienvenue sur CineApp !/i);
  expect(welcomeText).toBeInTheDocument();
});
