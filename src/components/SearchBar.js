import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dota2Heroes from '../../json/dota2heroes.json';
import heroData from '../../dotaconstants/build/heroes.json'

export default function SearchBar( {scrollY, topBar} ) {

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const searchBarRef = useRef(null);

  const handleBlur = (event) => {
    if (!searchBarRef.current.contains(event.relatedTarget)) {
      setTimeout(() => {
        setShowSuggestions(false);
      }, 100);
    }
  };

  const goToHero = () => {
    if (selectedSuggestionIndex !== -1) {
      const hero = suggestions[selectedSuggestionIndex];
      setSearchTerm(hero.name);
      setShowSuggestions(false);
      window.location.href = `/hero/${hero.url}/builds`;
    } 
    else {
      if (suggestions.length > 0) {
        const hero = suggestions[0];
        setSearchTerm(hero.name);
        setShowSuggestions(false);
        window.location.href = `/hero/${hero.url}/builds`;
      }
    }
  }

  useEffect(() => {
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
        goToHero()
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
    window.location.href = `/hero/${hero.url}/builds`;
  };

  return (
    <div ref={searchBarRef} className={`${scrollY == 0 ? 'w-[300px] sm:w-[800px] lg:w-[1200px]' : topBar ? 'w-[425px]' : 'w-[300px] sm:w-[700px] lg:w-[800px]'} transition-all duration-500 ease-in-out mx-auto shadow-sm rounded-[36px] overflow-hidden border border-slate-700 flex items-center`}>
      <div className="flex-1 h-[25px] sm:h-[44px] px-3 py-[12px] flex items-center">
        <img src="/Search.png" alt="Search Icon" className="w-4 h-4" />
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Search a hero"
            className={`${scrollY == 0 ? 'lg:w-[1050px]' : topBar ? 'sm:w-[325px]' : 'sm:w-[550px]'} text-slate-200 text-[15px] font-medium leading-5 bg-transparent border-none outline-none flex-1 tracking-wide px-2`}
          />
          {searchTerm && showSuggestions && suggestions.length > 0 && (
            <ul className={`absolute z-50 bg-white border border-gray-900 rounded-md shadow-md mt-2 sm:mt-4 text-black ${scrollY == 0 ? 'w-[200px] sm:w-[600px] lg:w-[1000px]' : topBar ? 'w-[325px]' : 'w-[200px] sm:w-500px lg:w-[600px]'}`}>
              {suggestions.map((hero, index) => (
                <li
                  key={hero.id}
                  onClick={() => handleSuggestionClick(hero)}
                  className={`px-2 py-1 sm:px-3 sm:py-2 gap-2 flex items-center text-white text-sm sm:text-md cursor-pointer z-50 border border-slate-700 hover:bg-slate-900 ${index === selectedSuggestionIndex ? 'bg-slate-900' : 'bg-slate-800'}`}
                >
                  <img src={'https://cdn.cloudflare.steamstatic.com' + heroData[hero.id].img} className="h-6 sm:h-10" />
                  {hero.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <button 
        className={`${topBar ? 'w-[70px] text-sm' : 'w-[80px] text-xs sm:text-sm sm:w-[94px]'} h-[30px] sm:h-[45px] sm:px-5 py-[9px] bg-gray-900 z-20 border-l border-slate-700 flex justify-center items-center text-slate-200 font-medium tracking-wide`}
        onClick={() => goToHero()}
      >
        Search
      </button>
      
    </div>
  );
}
