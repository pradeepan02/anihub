import React from 'react';
import { Link } from 'react-router-dom';
import './MovieList.css';

const MovieList = ({ anime }) => {
  return (
    <div className="movie-list">
      {anime.map(animeItem => (
        <Link to={`/anime/${animeItem.id}`} key={animeItem.id} className="movie-item">
          <div className="movie-card">
            <img src={animeItem.coverImage.large} alt={animeItem.title.romaji} />
            <h3>{animeItem.title.romaji}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MovieList;
