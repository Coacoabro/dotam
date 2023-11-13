//individual hero pages. Will have multiple components or pages for this

import React from 'react';
import { useRouter } from 'next/router';
import heroNames from '../../../dotaconstants/build/hero_names.json';

function HeroPage() {
  const router = useRouter();
  const { heroURL } = router.query;
  const heroName = 'npc_dota_hero_' + heroURL
  const heroData = heroNames[heroName]

  if (!heroData) {
    return <div>Hero not found</div>;
  }

  return (
    <div>
      <h1> <img src={'https://steamcdn-a.akamaihd.net/' + heroData.img} alt={heroData.localized_name} /> {heroData.localized_name}</h1>
      <div>Attack Type: {heroData.attack_type}</div>
    </div>
  );
}

export default HeroPage;
