import React from 'react';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; 
const MovieList = ({ movies }) => {
  const uniqueMovieIds = new Set();

  const moviesByYear = movies.reduce((acc, movie) => {
    const releaseYear = new Date(movie.release_date).getFullYear();
    if (releaseYear >= 2012) {
      if (!uniqueMovieIds.has(movie.id)) {
        uniqueMovieIds.add(movie.id); 
        if (!acc[releaseYear]) {
          acc[releaseYear] = [];
        }
        acc[releaseYear].push(movie);
      }
    }
    return acc;
  }, {});

  Object.keys(moviesByYear).forEach((year) => {
    moviesByYear[year].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  });

  const sortedYears = Object.keys(moviesByYear).sort((a, b) => a - b);

  return (
    <div className="movie-list">
      {sortedYears.map((year) => (
        <div key={year} className="year-group">
          <h2 className="year-heading">{year}</h2>
          <div className="movies-in-year">
            {moviesByYear[year].map((movie) => (
              <div key={movie.id} className="movie">
                <img
                  src={`${IMAGE_BASE_URL}/${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-rating">Rating: {movie.vote_average}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    
    </div>
  );
};

export default MovieList;
