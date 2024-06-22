import React, { memo } from 'react';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieList = memo(({ movies, genresType }) => {
  console.log("genresType", genresType);
  const uniqueMovieIds = new Set();

  const belongsToFilteredGenres = (movie) => {
    return movie.genre_ids.some(id => {
      return genresType.some(genre => genre.id === id);
    });
  };

  const moviesByYear = movies.reduce((acc, movie) => {
    const releaseYear = new Date(movie.release_date).getFullYear();
    if (releaseYear >= 2012 && belongsToFilteredGenres(movie)) {
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
    moviesByYear[year].sort((a, b) => b.vote_average - a.vote_average);

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
                  <p className="movie-release-year movie-rating">Release Year: {new Date(movie.release_date).getFullYear()}</p>

                  <p className="movie-title movie-rating">popularity:{movie.popularity}</p>
                  <p className="movie-genres movie-rating">Genres: {movie.genre_ids.map(id => genresType.find(genre => genre.id === id).name).join(', ')}</p>
                  {/* <p className="movie-director">
                    Director: {movie.director}
                  </p><p className="movie-overview">
                    Description: {movie.overview}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export default MovieList;
