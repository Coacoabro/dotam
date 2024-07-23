import heroData from '../../../dotaconstants/build/heroes.json';
import HeroTable from './Heroes/HeroTable';


export default function Heroes() {
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
    <div>
      <div 
        className="px-8 sm:px-12 lg:px-4 z-0 lg:max-w-6xl lg:mx-auto space-y-4 text-white"
      >        
        <div className="grid sm:grid-cols-2 gap-[15px] sm:gap-[25px]">
          <div>
            <HeroTable heroes={strengthHeroes} attr="Strength" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_strength.png"/>
          </div>
          <div>
            <HeroTable heroes={agilityHeroes} attr="Agility" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_agility.png"/>
          </div>
          <div>
            <HeroTable heroes={intelligenceHeroes} attr="Intelligence" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_intelligence.png" />
          </div>
          <div>
            <HeroTable heroes={universalHeroes} attr="Universal" img="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/hero_universal.png" />
          </div>
        </div>
      </div>
    </div>
    
  );
}