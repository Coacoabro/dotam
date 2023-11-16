//individual hero pages. Will have multiple components or pages for this

import React from 'react';
import { useRouter } from 'next/router';

import StaticHeroInfo from '../../components/StaticHeroInfo'
import heroNames from '../../../dotaconstants/build/hero_names.json';

function HeroPage() {
  
  const router = useRouter();
  const { heroURL } = router.query;
  const heroName = 'npc_dota_hero_' + heroURL
  const heroData = heroNames[heroName]

  if (!heroData) {
    return;
  }
  else {

    const img = 'https://steamcdn-a.akamaihd.net' + heroData.img

    return (
      <div className="flex">
        <img src={img} alt={heroName} />
        <StaticHeroInfo heroData={heroData}/>
      </div>
    );
  }

  
}

export default HeroPage;
