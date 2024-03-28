import React from 'react';
import heroData from '../../dotaconstants/build/heroes.json';
import HeroTable from '../components/Heroes/HeroTable';

function HeroList() {
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
    <div className="px-4 max-w-6xl mx-auto space-y-4" >
      <div className="text-3xl text-center py-2 text-white underline">DOTA 2 HEROES LIST</div>
      
      <div className="grid grid-cols-2 gap-5">
        <div>
          <HeroTable heroes={strengthHeroes} attr="STRENGTH" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_strength.png"/>
        </div>
        <div>
          <HeroTable heroes={agilityHeroes} attr="AGILITY" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_agility.png"/>
        </div>
        <div>
          <HeroTable heroes={intelligenceHeroes} attr="INTELLIGENCE" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_intelligence.png" />
        </div>
        <div>
          <HeroTable heroes={universalHeroes} attr="UNIVERSAL" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_universal.png" />
        </div>
      </div>
    </div>
    
  );
}

export default HeroList;
