import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from './MovieList';
import GenreFilter from './GenreFilter';
import { throttle } from 'lodash';

const API_KEY = '15f695c21470879249966ede084edc10';
const START_YEAR = 2012;
const MOVIES_PER_YEAR = 20;
const SELECTED_GENRES = ['Action', 'Comedy', 'Horror', 'Drama', 'Science Fiction'];

const MovieData = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(START_YEAR);
  const [loadedYears, setLoadedYears] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);

  const fetchMovies = async (year, genreId) => {
    try {
      setLoading(true);
      const params = {
        api_key: API_KEY,
        sort_by: 'popularity.desc',
        primary_release_year: year,
        'vote_count.gte': 100,
        page: 1,
      };

      if (genreId) {
        params['with_genres'] = genreId;
      }

      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, { params });
      const moviesForYear = response.data.results.slice(0, MOVIES_PER_YEAR);

      setMovies((prevMovies) => {
        const newMovies = [...prevMovies];
        moviesForYear.forEach((movie) => {
          if (!newMovies.some((m) => m.id === movie.id)) {
            newMovies.push(movie);
          }
        });
        return newMovies;
      });

      setLoadedYears((prevLoadedYears) => ({ ...prevLoadedYears, [year]: true }));
      setHasMore(year < new Date().getFullYear());

      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
        params: { api_key: API_KEY },
      });
      setGenres(response.data.genres);
    
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    setMovies([]);
    setCurrentYear(START_YEAR);
    setLoadedYears({});
    fetchMovies(START_YEAR, activeGenre);
  }, [activeGenre]);

  const throttledFetchMovies = useMemo(() => throttle(fetchMovies, 1000), []);

  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
  };

  const handleClearFilter = () => {
    setActiveGenre(null);
  };

  const loadMoreMovies = () => {
    const nextYear = currentYear + 1;
    if (!loadedYears[nextYear]) {
      throttledFetchMovies(nextYear, activeGenre);
      setCurrentYear(nextYear);
    }
  };

  return (
    <div className="MovieData">
      <GenreFilter genres={genres} onFilterChange={handleGenreChange} onClear={handleClearFilter} />
      <InfiniteScroll
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={hasMore}
        loader={<div className="loader"></div>}
        scrollThreshold={0.9}
      >
        <MovieList movies={movies} genresType={genres} />
      </InfiniteScroll>
      {loading && <div className="loader"></div>}
    </div>
  );
};

export default MovieData;
