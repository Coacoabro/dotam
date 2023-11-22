//individual hero pages. Will have multiple components or pages for this

import React from 'react';
import { useRouter } from 'next/router';

import StaticHeroInfo from '@/components/StaticHeroInfo'
import VariableHeroInfo from '@/components/VariableHeroInfo';
import heroNames from '../../dotaconstants/build/hero_names.json';

function HeroPage() {
  
  const router = useRouter();
  const { heroURL } = router.query;
  const heroName = 'npc_dota_hero_' + heroURL
  const heroData = heroNames[heroName]

  if (!heroData) {
    return;
  }
  else {

    const img = 'https://cdn.cloudflare.steamstatic.com/' + heroData.img

    return (
      <div className="p-4 bg-gray-700">
        <div className="flex p-1">
          <img src={img} alt={heroName} />
          <StaticHeroInfo heroData={heroData}/>
        </div>
        <div className="p-1">
          <VariableHeroInfo />
        </div>
      </div>
    );
  }

  
}

export default HeroPage;
