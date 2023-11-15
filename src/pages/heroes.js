import React from 'react';
import Link from 'next/link';
import heroData from '../../dotaconstants/build/hero_names.json';
import HeroTable from '../components/HeroTable';

function HeroList() {
  const sortedHeroData = Object.keys(heroData)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = heroData[key];
      return sorted;
    }, {});

  const strengthHeroes = Object.values(sortedHeroData).filter(hero => hero.primary_attr === 'str');
  const agilityHeroes = Object.values(sortedHeroData).filter(hero => hero.primary_attr === 'agi');
  const intelligenceHeroes = Object.values(sortedHeroData).filter(hero => hero.primary_attr === 'int');
  const universalHeroes = Object.values(sortedHeroData).filter(hero => hero.primary_attr === 'all');
  
  return (
    <div className="heroes-container">
      <div>
        <HeroTable heroes={strengthHeroes} attr="Strength" />
      </div>
      <div>
        <HeroTable heroes={agilityHeroes} attr="Agility" />
      </div>
      <div>
        <HeroTable heroes={intelligenceHeroes} attr="Intelligence" />
      </div>
      <div>
        <HeroTable heroes={universalHeroes} attr="Universal" />
      </div>
    </div>
  );
}

export default HeroList;
