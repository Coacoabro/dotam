import React from 'react';
import Link from 'next/link';
import heroData from '../../dotaconstants/build/hero_names.json';
import HeroTable from '../components/HeroTable';

function HeroList() {

  const strengthHeroes = Object.values(heroData).filter(hero => hero.primary_attr === 'str');
  const agilityHeroes = Object.values(heroData).filter(hero => hero.primary_attr === 'agi');
  const intelligenceHeroes = Object.values(heroData).filter(hero => hero.primary_attr === 'int');
  const universalHeroes = Object.values(heroData).filter(hero => hero.primary_attr === 'all');
  
  return (
    <div className="heroes-container">
      <div>
        <HeroTable heroes={strengthHeroes} />
      </div>
      <div>
        <HeroTable heroes={agilityHeroes} />
      </div>
      <div>
        <HeroTable heroes={intelligenceHeroes} />
      </div>
      <div>
        <HeroTable heroes={universalHeroes} />
      </div>
    </div>
  );
}

export default HeroList;
