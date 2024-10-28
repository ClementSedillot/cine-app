// src/pages/Helloworld.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../components/App'; 
test('renders Hello World text', () => {
  render(<App />);
  const helloText = screen.getByText(/Hello World for unit test/i);
  expect(helloText).toBeInTheDocument();
});
