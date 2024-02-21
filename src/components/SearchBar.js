import React, { useState, useEffect } from 'react';

import dota2Heroes from './dota2heroes.json'


const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  useEffect(() => {
    // Handle keyboard navigation through suggestions
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (selectedSuggestionIndex < suggestions.length - 1) {
          setSelectedSuggestionIndex(prevIndex => prevIndex + 1);
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (selectedSuggestionIndex > 0) {
          setSelectedSuggestionIndex(prevIndex => prevIndex - 1);
        }
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedSuggestionIndex !== -1) {
          const hero = suggestions[selectedSuggestionIndex];
          setSearchTerm(hero.name);
          setShowSuggestions(false);
          // Navigate to hero page using Next.js router
          window.location.href = `/hero/${hero.id}`;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSuggestionIndex, suggestions]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  
    // Filter heroes based on search term
    const filteredHeroes = dota2Heroes.filter(hero =>
      hero.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(filteredHeroes);
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
  };  

  const handleSuggestionClick = (hero) => {
    setSearchTerm(hero.name);
    setShowSuggestions(false);
    // Navigate to hero page using Next.js router
    window.location.href = `/hero/${hero.id}`;
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search Dota 2 heroes..."
        className="border border-gray-300 text-black rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1 w-full text-black">
          {suggestions.map((hero, index) => (
            <li
              key={hero.id}
              onClick={() => handleSuggestionClick(hero)}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedSuggestionIndex ? 'bg-blue-100' : ''
              }`}
            >
              {hero.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
