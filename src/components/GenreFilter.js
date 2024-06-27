import React, { useState, memo } from 'react';

const GenreFilter = memo(({ genres, onFilterChange, onClear }) => {
  const [activeGenre, setActiveGenre] = useState(null);

  const filteredGenres = genres.filter(genre => (
    genre.name === 'Action' || 
    genre.name === 'Comedy' || 
    genre.name === 'Horror' || 
    genre.name === 'Drama' || 
    genre.name === 'Science Fiction'
  ));

  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
    onFilterChange(genreId);
  };

  const handleClearFilter = () => {
    setActiveGenre(null);
    onClear(); 
  };

  return (
    <div className="genre-filter">
      <h1 className="red-heading">MOVIEFIX</h1>
      <div className="genre-buttons-container">
        <div className="genre-buttons">
          <button
            className={`genre-button ${activeGenre === null ? 'active' : ''}`}
            onClick={handleClearFilter}
          >
            All
          </button>
          {filteredGenres.map((genre) => (
            <button
              key={genre.id}
              className={`genre-button ${activeGenre === genre.id ? 'active' : ''}`}
              onClick={() => handleGenreChange(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default GenreFilter;
