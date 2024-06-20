import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from './MovieList';
import GenreFilter from './GenreFilter';
import { throttle } from 'lodash';

const API_KEY = '15f695c21470879249966ede084edc10';
const START_YEAR = 2012;
const MOVIES_PER_YEAR = 20;

const MovieData = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(START_YEAR);
  const [loadedYears, setLoadedYears] = useState({});
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMovies(START_YEAR); 
    fetchGenres(); 
  }, []);

  const fetchMovies = async (year) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: API_KEY,
          sort_by: 'popularity.desc',
          primary_release_year: year,
          'vote_count.gte': 100,
          page: 1,
        }
      });

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
      setLoading(false);

      setLoadedYears((prevLoadedYears) => ({ ...prevLoadedYears, [year]: true }));
      setHasMore(Object.keys(loadedYears).length < new Date().getFullYear() - START_YEAR + 1);

    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const throttledFetchMovies = throttle(fetchMovies, 1000);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
        params: {
          api_key: API_KEY
        }
      });
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleGenreChange = async (genreId) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: API_KEY,
          sort_by: 'popularity.desc',
          with_genres: genreId,
          'vote_count.gte': 100,
          page: 1,
        }
      });
      setMovies(response.data.results.slice(0, MOVIES_PER_YEAR));
      setLoading(false);
      setLoadedYears({});
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      setLoading(false);
    }
  };

  const handleClearFilter = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: API_KEY,
          sort_by: 'popularity.desc',
          primary_release_year: START_YEAR,
          'vote_count.gte': 100,
          page: 1,
        }
      });
      setMovies(response.data.results.slice(0, MOVIES_PER_YEAR)); 
      setLoading(false);
      setLoadedYears({}); 
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    const nextYear = currentYear + 1;
    if (!loadedYears[nextYear]) {
      throttledFetchMovies(nextYear);
      setCurrentYear(nextYear);
    }
  };

  return (
    <div className="MovieData">
      <GenreFilter genres={genres} onChange={handleGenreChange} onClear={handleClearFilter} />
      <InfiniteScroll
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={hasMore}
        loader={<div className="loader"></div>}
        scrollThreshold={0.9}
      >
        <MovieList movies={movies} />
      </InfiniteScroll>
      {loading && <div className="loader"></div>}
    </div>
  );
};

export default MovieData;
