import { useQuery } from 'react-query';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'

import IoLoading from '../IoLoading';
import StaticInfo from '../HeroPage/Static/StaticInfo'
import OptionsContainer from './OptionsContainer';
import RatesContainer from './Variable/Rates/RatesContainer';

const fetchHeroData = async (hero, type) => {
  const response = await fetch(`/api/${hero}?type=${type}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function HeroLayout({ children, hero }) {

  const { data: heroInfo, isLoading: infoLoading } = useQuery(['heroData', hero.url, 'info'], () => fetchHeroData(hero.url, 'info'), {staleTime: 3600000});
  const { data: heroRates, isLoading: ratesLoading } = useQuery(['heroData', hero.url, 'rates'], () => fetchHeroData(hero.url, 'rates'), {staleTime: 3600000});
  const { data: heroBuilds, isLoading: buildsLoading } = useQuery(['heroData', hero.url, 'builds'], () => fetchHeroData(hero.url, 'builds'), {staleTime: 3600000});

  if(infoLoading || ratesLoading){
    return(<IoLoading />)
  }
  else {

    const heroData = heroInfo[0]
  
    const heroName = hero.name

    const highestPickRateRole = heroRates
      .filter(rate => rate.role !== "" && rate.rank == "")
      .reduce((max, rate) => rate.pickrate > max.pickrate ? rate : max, {pickrate: 0});
    
    const initRole = highestPickRateRole.role

    const portrait = 'https://cdn.cloudflare.steamstatic.com' + heroData.img
    const crop_img = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/' + heroData.name.replace('npc_dota_hero_', '') + '.png'
    const hero_vid = 'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/' + heroData.name.replace('npc_dota_hero_', '') + '.webm'

    return(
      <div className="px-4 sm:pt-14 sm:mx-auto sm:max-w-7xl space-y-2 sm:space-y-0">

        <div className="px-2 flex relative items-end sm:items-center gap-1 sm:gap-4">

          <img src={portrait} className="h-14 sm:h-32" />

          <div className="sm:py-7 sm:px-2 flex-col space-y-2 z-20">
            <div className="text-2xl sm:text-5xl font-bold ml-2">{heroName}</div>
            <div className="hidden sm:block"><StaticInfo hero={heroData} /></div>
          </div>

          <div className="hidden sm:flex absolute right-0 mt-24 h-72 opacity-25">
            <img src={crop_img} className="object-cover w-full h-full" />
          </div>

        </div>

        <div className="sm:hidden absolute h-36 right-0 top-14 opacity-25">
          <img src={crop_img} className="object-cover w-full h-full" />
        </div>

        <div className="absolute sm:hidden z-10">
          <StaticInfo hero={heroData} />
        </div>

        <div className='flex space-x-3'>
          <RatesContainer rates={heroRates} initRole={initRole} />
          <div className='w-64'>
            Highest win rate for {heroName}. Builds and more info blah blah blah
          </div>
        </div>

        <div className='flex space-x-2'>
          <Link href={`/hero/${hero.url}/builds`}>Builds</Link>
          <Link href={`/hero/${hero.url}/items`}>Items</Link>
        </div>

        <OptionsContainer initRole={initRole} />

        {heroBuilds ? (
          <main>
            {React.Children.map(children, child =>
              React.cloneElement(child, { initRole, heroData, heroBuilds })
            )}
          </main>
        ) : (
          <div>Loading</div>
        )}

      </div>
    )
  }
}