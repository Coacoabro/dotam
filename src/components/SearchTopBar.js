import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dota2Heroes from '../../json/dota2heroes.json';
import heroData from '../../dotaconstants/build/heroes.json'

export default function SearchBar() {

  const router = useRouter();

  const [expandSearch, setExpandSearch] = useState(false)

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

    const filteredHeroes = value.toLowerCase() == "tracker" ? [dota2Heroes[60]] : 
      dota2Heroes.filter(hero =>
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
    <div className={`flex transition-all ease-in-out duration-500 ${expandSearch ? 'w-[225px] sm:w-[350px] lg:w-[500px]' : 'w-[30px]'}`}>
        <button onClick={() => setExpandSearch(!expandSearch)}><img className={`${!expandSearch ? " w-6 h-6" : "hidden"}`} src="/search-icon.svg" /></button>
        <div ref={searchBarRef} className={`${expandSearch ? 'w-[225px] sm:w-[350px] lg:w-[500px]' : 'hidden'} transition-all duration-500 ease-in-out mx-auto shadow-sm rounded-[36px] border border-slate-700 flex items-center`}>
            <div className="h-[25px] sm:h-[44px] px-3 py-[12px] flex items-center">
                <button onClick={() => setExpandSearch(!expandSearch)}><img src="/search-icon.svg" alt="Search Icon" className='w-4 h-4' /></button>
                <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Search a hero..."
                    className={`w-[175px] sm:w-[245px] lg:w-[387.5px] text-slate-200 text-sm sm:text-lg font-medium leading-5 bg-transparent border-none outline-none flex-1 tracking-wide px-2`}
                />
                {searchTerm && showSuggestions && suggestions.length > 0 && (
                    <ul className={`absolute border border-gray-900 rounded-md rounded shadow-md mt-2 sm:mt-4 text-black w-[175px] sm:w-[250px] lg:w-[400px]`}>
                    {suggestions.map((hero, index) => (
                        <li
                        key={hero.id}
                        onClick={() => handleSuggestionClick(hero)}
                        className={`${index == 0 ? 'rounded-t-lg' : null} ${index == suggestions.length - 1 ? 'rounded-b-lg' : null} px-2 py-1 sm:px-3 sm:py-2 gap-2 flex items-center text-white text-sm sm:text-lg cursor-pointer z-50 border border-slate-700 hover:bg-slate-900 ${index === selectedSuggestionIndex ? 'bg-slate-900' : 'bg-slate-800'}`}
                        >
                          <img src={'https://cdn.cloudflare.steamstatic.com' + heroData[hero.id].img} className="h-6 sm:h-10 sm:px-2" />
                          {hero.name}
                        </li>
                    ))}
                    </ul>
                )}
                </div>
            </div>
            <button 
                className={`hidden sm:flex sm:w-[62.5px] lg:w-[70px] rounded-r-full text-sm h-[30px] sm:h-[45px] sm:px-5 py-[9px] bg-gray-900 z-20 border-l border-slate-700 flex justify-center items-center text-slate-200 font-medium tracking-wide`}
                onClick={() => goToHero()}
            >
                Search
            </button>    
        </div>
    </div>
  );
}
