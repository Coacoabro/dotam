import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

import heroData from '../../../dotaconstants/build/heroes.json';
import HeroTable from './Heroes/HeroTable';
import HeroSearch from './Heroes/HeroSearch';
import Role from '../Role';


export default function Heroes({scrollY}) {

  const router = useRouter()

  const {role} = router.query

  const [searchTerm, setSearchTerm] = useState('')
  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const sortedHeroData = Object.values(heroData)
    .sort((a, b) => {
      const nameA = a.localized_name;
      const nameB = b.localized_name;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

  const strengthHeroes = Object.values(sortedHeroData).filter(hero => hero.primary_attr === 'str');
  const agilityHeroes = Object.values(sortedHeroData).filter(hero => hero.primary_attr === 'agi');
  const intelligenceHeroes = Object.values(sortedHeroData).filter(hero => hero.primary_attr === 'int');
  const universalHeroes = Object.values(sortedHeroData).filter(hero => hero.primary_attr === 'all');
  
  return (
    <div className='space-y-12'>
      <div>
        <HeroSearch onSearch={handleSearch} scrollY={scrollY} />
      </div>
      <div className={`transition-all duration-500 ease-in-out px-2 z-0 lg:max-w-6xl lg:mx-auto space-y-6 text-slate-200 ${(scrollY !== 0 && router.pathname == '/') || router.pathname == '/heroes' ? 'blur-none opacity-100' : 'blur opacity-25'}`}>        
        <div className='sm:flex justify-center items-center space-x-4'>
          <p className='sm:text-xl text-center'>Roles:</p>
          <Role />
        </div>
        <div className="grid sm:grid-cols-2 gap-[10px] lg:gap-[25px]">
          <div>
            <HeroTable heroes={strengthHeroes} search={searchTerm} attr="Strength" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_strength.png"/>
          </div>
          <div>
            <HeroTable heroes={agilityHeroes} search={searchTerm} attr="Agility" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_agility.png"/>
          </div>
          <div>
            <HeroTable heroes={intelligenceHeroes} search={searchTerm} attr="Intelligence" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_intelligence.png" />
          </div>
          <div>
            <HeroTable heroes={universalHeroes} search={searchTerm} attr="Universal" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_universal.png" />
          </div>
        </div>
      </div>
    </div>
    
  );
}