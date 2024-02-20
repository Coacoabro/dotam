import React, { useState } from 'react';

import dota2Heroes from './dota2heroes.json'

// Dummy data for Dota 2 heroes


const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter heroes based on search term
    const filteredHeroes = dota2Heroes.filter(hero =>
      hero.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredHeroes);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (hero) => {
    setSearchTerm(hero.name);
    setShowSuggestions(false);
    // Navigate to hero page using Next.js router
    window.location.href = `/hero/${hero.id}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Find hero with exact name match
      const hero = dota2Heroes.find(hero =>
        hero.name.toLowerCase() === searchTerm.toLowerCase()
      );
      if (hero) {
        // Navigate to hero page using Next.js router
        window.location.href = `/hero/${hero.id}`;
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search Dota 2 heroes..."
        className="border border-gray-300 text-black rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
      />
      {showSuggestions && (
        <ul className="absolute z-10 bg-white text-black border border-gray-300 rounded-md shadow-md mt-1 w-full">
          {suggestions.map(hero => (
            <li key={hero.id} onClick={() => handleSuggestionClick(hero)} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
              {hero.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
