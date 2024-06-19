import axios from 'axios';

const API_KEY = '15f695c21470879249966ede084edc10';

export const fetchMovies = (year, genres = []) => {
  const genreQuery = genres.length ? `&with_genres=${genres.join(',')}` : '';
  return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&vote_count.gte=100${genreQuery}`);
};

export const fetchGenres = () => {
  return axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
};
