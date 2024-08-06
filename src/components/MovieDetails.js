import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { request, gql } from 'graphql-request';
import './MovieDetails.css';

const ANILIST_API_URL = 'https://graphql.anilist.co';

const MovieDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      try {
        const query = gql`
          query ($id: Int) {
            Media (id: $id, type: ANIME) {
              id
              title {
                romaji
                english
                native
              }
              description
              coverImage {
                large
              }
              bannerImage
              episodes
              genres
              averageScore
              characters (sort: ROLE) {
                edges {
                  node {
                    id
                    name {
                      full
                    }
                    image {
                      large
                    }
                  }
                  role
                }
              }
              staff (sort: RELEVANCE) {
                edges {
                  node {
                    id
                    name {
                      full
                    }
                    image {
                      large
                    }
                    primaryOccupations
                  }
                }
              }
            }
          }
        `;
        const variables = {
          id: parseInt(id)
        };

        const response = await request(ANILIST_API_URL, query, variables);
        setAnime(response.Media);
      } catch (error) {
        console.error('Error fetching anime details:', error);
        setError('Failed to load anime details.');
      }
      setLoading(false);
    };
    fetchAnimeDetails();
  }, [id]);

  if (loading) return <div className="spinner"></div>;

  if (error) return <div>{error}</div>;

  if (!anime) return <div>Anime not found</div>;

  const imageUrl = anime.coverImage?.large || 'https://via.placeholder.com/200x300';
  const genres = anime.genres?.join(', ');

  return (
    <div className="movie-details">
      <div className="movie-poster">
        <img src={imageUrl} alt={anime.title.romaji} />
      </div>
      <div className="movie-info">
        <h2>{anime.title.romaji} ({anime.title.english})</h2>
        <p><strong>Rating:</strong> {anime.averageScore}</p>
        <p><strong>Episodes:</strong> {anime.episodes}</p>
        <p><strong>Overview:</strong> {anime.description}</p>
        <p><strong>Genres:</strong> {genres}</p>
        <h3>Characters</h3>
        <div className="cast-crew-row">
          {anime.characters.edges.length > 0 ? (
            anime.characters.edges.map(character => (
              <div key={character.node.id} className="member-card">
                <img src={character.node.image.large} alt={character.node.name.full} />
                <p>{character.node.name.full}</p>
                <p>{character.role}</p>
              </div>
            ))
          ) : (
            <p>No characters found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
