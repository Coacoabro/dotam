import heroData from '../../dotaconstants/build/heroes.json';
import HeroTable from '../components/Home/Heroes/HeroTable';
import SearchBar from '../components/SearchBar'

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
    <div className='py-10 space-y-10 z-0'>
        <SearchBar />
        <div className="px-4 z-0 max-w-6xl mx-auto space-y-4 text-white">        
            <div className="grid grid-cols-2 gap-1 md:gap-5">
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