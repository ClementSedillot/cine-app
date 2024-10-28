import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Movies from './Movies';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Movies Page', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Inception',
      poster_path: '/path_to_image',
      overview: 'A mind-bending thriller',
      release_date: '2010-07-16',
      genre_ids: [28, 878],
      original_language: 'en',
    },
    {
      id: 2,
      title: 'Interstellar',
      poster_path: '/path_to_image',
      overview: 'A journey beyond the stars',
      release_date: '2014-11-07',
      genre_ids: [12, 878],
      original_language: 'en',
    },
  ];

  const mockGenres = [
    { id: 28, name: 'Action' },
    { id: 878, name: 'Science-fiction' },
    { id: 12, name: 'Adventure' },
  ];

  beforeEach(() => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/genre/movie/list')) {
        return Promise.resolve({ data: { genres: mockGenres } });
      } else if (url.includes('/movie/popular')) {
        return Promise.resolve({ data: { results: mockMovies } });
      }
      return Promise.reject(new Error('not found'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Affiche les films récupérés depuis l’API', async () => {
    render(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    // Vérifie que les films sont bien affichés après le chargement
    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
    });
  });

  test('Recherche de film fonctionne', async () => {
    render(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Rechercher un film...');
    fireEvent.change(searchInput, { target: { value: 'Interstellar' } });

    await waitFor(() => {
      expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
      expect(screen.queryByText(/Inception/i)).not.toBeInTheDocument();
    });
  });

  test('Filtre par genre fonctionne', async () => {
    render(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
    });

    const genreSelect = screen.getByLabelText(/Toutes les catégories/i);
    fireEvent.change(genreSelect, { target: { value: '878' } });

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
    });
  });

  test('Filtre par année fonctionne', async () => {
    render(
      <BrowserRouter>
        <Movies />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
    });

    const yearSelect = screen.getByLabelText(/Toutes les années/i);
    fireEvent.change(yearSelect, { target: { value: '2010' } });

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.queryByText(/Interstellar/i)).not.toBeInTheDocument();
    });
  });
});
