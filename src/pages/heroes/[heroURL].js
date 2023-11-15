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
    return <div>Hero not found</div>;
  }

  return (
    <div>
      <img src={'https://steamcdn-a.akamaihd.net/' + heroData.img} alt={heroData.localized_name} />
      <StaticHeroInfo hero = {heroName} />
      <div>Attack Type: {heroData.attack_type}</div>
    </div>
  );
}

export default HeroPage;
