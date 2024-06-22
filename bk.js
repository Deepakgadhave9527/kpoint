


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
cd       const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
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










import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from './MovieList';
import GenreFilter from './GenreFilter';
import { throttle } from 'lodash';

const API_KEY = '15f695c21470879249966ede084edc10';
const START_YEAR = 2012;
const MOVIES_PER_YEAR = 20;
const MOVIES_PER_PAGE = 20;

const MovieData = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(START_YEAR);
  const [loadedYears, setLoadedYears] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);
  const [page, setPage] = useState(1);

 
  const fetchMovies = async (year) => {
    
    try {
    

      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: params
      });

      const newMovies = response.data.results.slice(0, MOVIES_PER_PAGE);

      setMovies(prevMovies => {
        return [...prevMovies, ...newMovies];
      });

      setLoading(false);
      return newMovies;
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
      return [];
    }
  };


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

  useEffect(() => {
    fetchMovies(START_YEAR); 
    fetchGenres(); 
  }, []);

  const handleGenreChange = async (genreId) => {
  
    setActiveGenre(genreId);
    setCurrentYear(START_YEAR);
    setMovies([]);
    setPage(1);
  };

  const handleClearFilter = useCallback(() => {
    setActiveGenre(null);
    setCurrentYear(START_YEAR);
    setMovies([]);
    setPage(1);
  }, []);

  const loadMoreMovies = () => {
    setPage(page + 1);
  };
  useEffect(() => { 
    fetchMovies(START_YEAR)
  },[activeGenre])

console.log(activeGenre);

  useEffect(() => {
    const fetchAllMovies = async () => {
      const currentYear = new Date().getFullYear();
      let moviesForAllYears = [];

      for (let year = START_YEAR; year <= currentYear; year++) {
        const newMovies = await fetchMovies(year);
        if (newMovies.length === 0) break;
        moviesForAllYears = [...moviesForAllYears, ...newMovies];
      }

      setMovies(moviesForAllYears);
      setLoading(false);
    };

    fetchAllMovies();
  }, [activeGenre]);


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
        <MovieList movies={movies}  
        genres2={genres}
        />
      </InfiniteScroll>
      {loading && <div className="loader"></div>}
    </div>
  );
};

export default MovieData;




import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from './MovieList';
import GenreFilter from './GenreFilter';

const API_KEY = '15f695c21470879249966ede084edc10';
const START_YEAR = 2012;
const MOVIES_PER_PAGE = 20;

const MovieData = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(START_YEAR);
  const [activeGenre, setActiveGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (year) => {
    try {
      setLoading(true);
      const params = {
        api_key: API_KEY,
        sort_by: 'popularity.desc',
        primary_release_year: year,
        'vote_count.gte': 100,
        page: 1,
      };

      if (activeGenre) {
        params['with_genres'] = activeGenre;
      }

      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: params
      });

      const newMovies = response.data.results.slice(0, MOVIES_PER_PAGE);

      setMovies(prevMovies => {
        return [...prevMovies, ...newMovies];
      });

      setLoading(false);
      return newMovies;
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
      return [];
    }
  };

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

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleGenreChange = useCallback(async (genreId) => {
    setActiveGenre(genreId);
    setCurrentYear(START_YEAR);
    setMovies([]);
    setPage(1);
  }, []);

  const handleClearFilter = useCallback(() => {
    setActiveGenre(null);
    setCurrentYear(START_YEAR);
    setMovies([]);
    setPage(1);
  }, []);

  const loadMoreMovies = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      const currentYear = new Date().getFullYear();
      let moviesForAllYears = [];

      for (let year = START_YEAR; year <= currentYear; year++) {
        const newMovies = await fetchMovies(year);
        if (newMovies.length === 0) break;
        moviesForAllYears = [...moviesForAllYears, ...newMovies];
      }

      setMovies(moviesForAllYears);
      setLoading(false);
    };

    fetchAllMovies();
  }, [activeGenre]);

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
        <MovieList movies={movies}
          genres2={genres}

        />
      </InfiniteScroll>
      {loading && <div className="loader"></div>}
    </div>
  );
};

export default MovieData;













































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
























import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from './MovieList';
import GenreFilter from './GenreFilter';

const API_KEY = '15f695c21470879249966ede084edc10';
const START_YEAR = 2012;
const MOVIES_PER_PAGE = 20;

const MovieData = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (year) => {
    try {
      setLoading(true);
      const params = {
        api_key: API_KEY,
        sort_by: 'popularity.desc',
        primary_release_year: year,
        'vote_count.gte': 100,
        page: page,
      };

      if (activeGenre) {
        params['with_genres'] = activeGenre;
      }

      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: params
      });

      const newMovies = response.data.results.slice(0, MOVIES_PER_PAGE);

      setMovies(prevMovies => {
        return [...prevMovies, ...newMovies];
      });

      setLoading(false);
      return newMovies;
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
      return [];
    }
  };

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

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleGenreChange = useCallback(async (genreId) => {
    setActiveGenre(genreId);
    setMovies([]);
    setPage(1);
  }, []);

  const handleClearFilter = useCallback(() => {
    setActiveGenre(null);
    setMovies([]);
    setPage(1);
  }, []);

  const loadMoreMovies = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      const currentYear = new Date().getFullYear();
      let moviesForAllYears = [];

      for (let year = START_YEAR; year <= currentYear; year++) {
        const newMovies = await fetchMovies(year);
        if (newMovies.length === 0) break;
        moviesForAllYears = [...moviesForAllYears, ...newMovies];
      }

      setMovies(moviesForAllYears);
      setLoading(false);
    };

    fetchAllMovies();
  }, [activeGenre, page]);

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
        <MovieList movies={movies} 
        genres2={genres}/>
      </InfiniteScroll>
      {loading && <div className="loader"></div>}
    </div>
  );
};

export default MovieData;





import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from './MovieList';
import GenreFilter from './GenreFilter';

const API_KEY = '15f695c21470879249966ede084edc10';
const START_YEAR = 2012;
const MOVIES_PER_YEAR = 20;
const MOVIES_PER_PAGE = 20;

const MovieData = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(START_YEAR);
  const [loadedYears, setLoadedYears] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    fetchMovies(START_YEAR);
    fetchGenres();
  }, []);

  const fetchMovies = async (year,genreId) => {
    const params = {
      api_key: API_KEY,
      sort_by: 'popularity.desc',
      primary_release_year: year,
      'vote_count.gte': 1000,
      page: Math.ceil(movies.length / MOVIES_PER_PAGE) + 1,
    };

    if (genreId) {
      params['with_genres'] = genreId;
    }
    try {
      setLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: params
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

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleGenreChange = async (genreId) => {
    setActiveGenre(genreId);
    setCurrentYear(START_YEAR); 
    setMovies([]);
  };
  useEffect(() => {
    if (activeGenre === null) {
      fetchMovies(currentYear);
    } else {
      fetchMovies(currentYear, activeGenre);
    }
  }, [currentYear, activeGenre]);

  const handleClearFilter = useCallback(() => {
    setActiveGenre(null);
    setCurrentYear(START_YEAR); 
    setMovies([]); 
  }, []);

  const loadMoreMovies = () => {
    const nextYear = currentYear + 1;
    if (!loadedYears[nextYear]) {
      fetchMovies(nextYear);
      setCurrentYear(nextYear);
    }
  };

  const fetchMoreMovies = () => {
    if (!loading && hasMore) {
      if (activeGenre === null) {
        fetchMovies(currentYear);
      } else {
        fetchMovies(currentYear, activeGenre);
      }
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
        onScroll={fetchMoreMovies}

      >
        <MovieList movies={movies} 
                genres2={genres} 

        />
      </InfiniteScroll>
      {loading && <div className="loader"></div>}
    </div>
  );
};

export default MovieData;







import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from './MovieList';
import GenreFilter from './GenreFilter';

const API_KEY = '15f695c21470879249966ede084edc10';
const START_YEAR = 2012;
const MOVIES_PER_PAGE = 20;

const MovieData = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(START_YEAR);
  const [loadedYears, setLoadedYears] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);

  // Function to fetch movies from API
  const fetchMovies = async (year, genreId = null) => {
    try {
      setLoading(true);
      const params = {
        api_key: API_KEY,
        sort_by: 'popularity.desc',
        primary_release_year: year,
        'vote_count.gte': 100,
        page: Math.ceil(movies.length / MOVIES_PER_PAGE) + 1,
      };

      if (genreId) {
        params['with_genres'] = genreId;
      }

      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: params
      });

      const newMovies = response.data.results;
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      setLoading(false);

      setLoadedYears((prevLoadedYears) => ({ ...prevLoadedYears, [year]: true }));
      setHasMore(newMovies.length === MOVIES_PER_PAGE);

    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  // Fetch genres on component mount
  useEffect(() => {
    fetchGenres();
  }, []);

  // Fetch genres function
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

  // Effect to fetch movies when year or genre changes
  useEffect(() => {
    if (activeGenre === null) {
      fetchMovies(currentYear);
    } else {
      fetchMovies(currentYear, activeGenre);
    }
  }, [currentYear, activeGenre]);

  // Handle genre filter change
  const handleFilterChange = useCallback((genreId) => {
    setActiveGenre(genreId);
    setCurrentYear(START_YEAR); // Reset year to start fetching from the beginning
    setMovies([]); // Clear movies to start fresh with new genre filter
  }, []);

  // Handle clear filter
  const handleClearFilter = useCallback(() => {
    setActiveGenre(null);
    setCurrentYear(START_YEAR); // Reset year to start fetching from the beginning
    setMovies([]); // Clear movies to start fresh without any genre filter
  }, []);

  // Load more movies for the next year
  const loadMoreMovies = () => {
    const nextYear = currentYear + 1;
    if (!loadedYears[nextYear]) {
      setCurrentYear(nextYear);
    }
  };

  // Function to determine if more movies should be fetched based on scrolling
  const fetchMoreMovies = () => {
    if (!loading && hasMore) {
      if (activeGenre === null) {
        fetchMovies(currentYear);
      } else {
        fetchMovies(currentYear, activeGenre);
      }
    }
  };

  return (
    <div className="MovieData">
      {/* Genre filter component */}
      <GenreFilter genres={genres} onFilterChange={handleFilterChange} onClear={handleClearFilter} />

      {/* Infinite scroll for movie list */}
      <InfiniteScroll
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={hasMore}
        loader={<div className="loader" key={0}></div>}
        scrollThreshold={0.9}
        endMessage={<p>No more movies to load.</p>}
        onScroll={fetchMoreMovies}
      >
        {/* Movie list component */}
        <MovieList movies={movies} />
      </InfiniteScroll>

      {/* Loading spinner */}
      {loading && <div className="loader"></div>}
    </div>
  );
};

export default MovieData;












































import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from './MovieList';
import GenreFilter from './GenreFilter';
import { throttle } from 'lodash';

const API_KEY = '15f695c21470879249966ede084edc10';
const START_YEAR = 2012;
const MOVIES_PER_PAGE = 20;

const MovieData = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(START_YEAR);
  const [loadedYears, setLoadedYears] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);

  // Function to fetch movies from API
  const fetchMovies = async (year, genreId = null) => {
    try {
      setLoading(true);
      const params = {
        api_key: API_KEY,
        sort_by: 'popularity.desc',
        primary_release_year: year,
        'vote_count.gte': 100,
        page: Math.ceil(movies.length / MOVIES_PER_PAGE) + 1,
      };

      if (genreId) {
        params['with_genres'] = genreId;
      }

      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: params
      });

      const newMovies = response.data.results;
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      setLoading(false);

      setLoadedYears((prevLoadedYears) => ({ ...prevLoadedYears, [year]: true }));
      setHasMore(newMovies.length === MOVIES_PER_PAGE);

    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  // Throttled fetchMovies function to avoid rapid API calls
  const throttledFetchMovies = throttle(fetchMovies, 1000);

  // Fetch genres on component mount
  useEffect(() => {
    fetchGenres();
  }, []);

  // Fetch genres function
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

  // Effect to fetch movies when year or genre changes
  useEffect(() => {
    fetchMovies(currentYear, activeGenre);
  }, [currentYear, activeGenre]);

  // Handle genre filter change
  const handleFilterChange = useCallback((genreId) => {
    setActiveGenre(genreId);
    setCurrentYear(START_YEAR); // Reset year to start fetching from the beginning
    setMovies([]); // Clear movies to start fresh with new genre filter
  }, []);

  // Handle clear filter
  const handleClearFilter = useCallback(() => {
    setActiveGenre(null);
    setCurrentYear(START_YEAR); // Reset year to start fetching from the beginning
    setMovies([]); // Clear movies to start fresh without any genre filter
  }, []);

  // Load more movies for the next year
  const loadMoreMovies = () => {
    const nextYear = currentYear + 1;
    if (!loadedYears[nextYear]) {
      setCurrentYear(nextYear);
    }
  };

  // Function to determine if more movies should be fetched based on scrolling
  const fetchMoreMovies = () => {
    if (!loading && hasMore) {
      throttledFetchMovies(currentYear, activeGenre);
    }
  };

  return (
    <div className="MovieData">
      {/* Genre filter component */}
      <GenreFilter genres={genres} onFilterChange={handleFilterChange} onClear={handleClearFilter} />

      {/* Infinite scroll for movie list */}
      <InfiniteScroll
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={hasMore}
        loader={<div className="loader" key={0}></div>}
        scrollThreshold={0.9}
        endMessage={<p>No more movies to load.</p>}
        onScroll={fetchMoreMovies}
      >
        {/* Movie list component */}
        <MovieList movies={movies} 
        genres2={genres} 
        />
      </InfiniteScroll>

      {/* Loading spinner */}
      {loading && <div className="loader"></div>}
    </div>
  );
};

export default MovieData;
