import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { request, gql } from 'graphql-request';
import './App.css';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import LoadingSpinner from './components/LoadingSpinner';

const ANILIST_API_URL = 'https://graphql.anilist.co';

const App = () => {
  const [anime, setAnime] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const query = gql`
          query ($search: String) {
            Page (page: 1, perPage: 10) {
              media (search: $search, type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  large
                }
              }
            }
          }
        `;
        const variables = {
          search: searchQuery || null
        };

        const response = await request(ANILIST_API_URL, query, variables);
        setAnime(response.Page.media);
      } catch (error) {
        console.error('Error fetching the anime:', error);
      }
      setLoading(false);
    };
    fetchAnime();
  }, [searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.elements.query.value);
  };

  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1>AniHub</h1>
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              name="query" 
              placeholder="Search for anime..." 
            />
            <button type="submit">Search</button>
          </form>
        </header>
        {loading && <LoadingSpinner />}
        <Routes>
          <Route path="/" element={<MovieList anime={anime} />} />
          <Route path="/anime/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
