import { useQuery } from 'react-query';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'

import IoLoading from '../../IoLoading';
import LoadingWheel from '../../LoadingWheel';
import StaticInfo from '../Layout/Static/StaticInfo'
import OptionsContainer from './OptionsContainer';
import RatesContainer from './Rates/RatesContainer';
import BottomBar from '../../BottomBar';

import Patches from '../../../../json/Patches.json'
import MiniLoadingWheel from '../../MiniLoadingWheel';

const fetchHeroData = async (hero, type, patch) => {
  const response = await fetch(`/api/${hero}?type=${type}&patch=${patch}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function HeroLayout({ children, hero, current_patch }) {

  const router = useRouter()
  const {rank, role, patch, facet} = router.query

  const [currPatch, setCurrPatch] = useState(patch || current_patch)

  const { data: heroInfo, isLoading: infoLoading } = useQuery(['heroData', hero.url, 'info'], () => fetchHeroData(hero.url, 'info'), {staleTime: 3600000});
  const { data: heroBuilds, isLoading: buildsLoading } = useQuery(['heroData', hero.url, 'builds', currPatch], () => fetchHeroData(hero.url, 'builds', currPatch), {staleTime: 3600000});
  const { data: heroRates, isLoading: ratesLoading } = useQuery(['heroData', hero.url, 'rates'], () => fetchHeroData(hero.url, 'rates'), {staleTime: 3600000});
  const { data: heroMatchups, isLoading: matchupsLoading } = useQuery(['heroData', hero.url, 'matchups'], () => fetchHeroData(hero.url, 'matchups'), {staleTime: 3600000});

  useEffect(() => {
    if(patch){setCurrPatch(patch)}
  }, [patch])

  if(infoLoading || ratesLoading){
    <IoLoading />
  }
  else{

    const buildFinder = heroRates.main

    const heroData = heroInfo[0]

    const heroName = hero.name

    const highestPickRateRole = heroRates.rates
      .filter(rate => rate.role !== "" && rate.rank == "")
      .reduce((max, rate) => rate.pickrate > max.pickrate ? rate : max, {pickrate: 0});
    
    const initRole = highestPickRateRole.role

    const initFacet = (() => {
      let most = 0;
      let best = 0;
      if(heroBuilds){
        heroBuilds.forEach((obj) => {
          if (obj.role === initRole && obj.rank === "") {
            if (obj.total_matches > most) {
              most = obj.total_matches;
              best = obj.facet;
            }
          }
        });
        return best;
      }
    })();

    const portrait = 'https://cdn.cloudflare.steamstatic.com' + heroData.img
    const crop_img = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/' + heroData.name.replace('npc_dota_hero_', '') + '.png'
    const hero_vid = 'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/' + heroData.name.replace('npc_dota_hero_', '') + '.webm'

    return(
      <div className="px-1 sm:px-4 sm:pt-14 sm:mx-auto sm:max-w-7xl space-y-2 sm:space-y-0">

        <div className="flex relative items-end sm:items-center gap-1 sm:gap-4">

          <img src={portrait} className="h-14 sm:h-32" />

          <div className="sm:py-7 sm:px-2 flex-col space-y-2 z-20 sm:z-50">
            <div className="text-2xl sm:text-5xl font-bold ml-2">{heroName}</div>
            <div className="hidden sm:block"><StaticInfo hero={heroData} /></div>
          </div>

          <div className="hidden sm:flex absolute right-0 mt-20 h-72 opacity-25 z-0">
            <img src={crop_img} className="object-cover w-full h-full" />
          </div>

        </div>

        <div className="sm:hidden absolute h-36 right-0 top-16 opacity-25">
          <img src={crop_img} className="object-cover w-full h-full" />
        </div>

        <div className="block sm:hidden z-10">
          <StaticInfo hero={heroData} />
        </div>

        <div className='flex space-x-3'>
          <RatesContainer rates={heroRates.rates} initRole={initRole} current_patch={current_patch} />
          <div className='w-64 hidden sm:block'>
            <h1>Builds for {hero.name}</h1>
          </div>
        </div>

        <div className='py-3 z-0 px-0 sm:px-32 lg:px-0'>
          <OptionsContainer hero={hero} initRole={initRole} initFacet={initFacet} />
        </div>

        {buildsLoading ? (<LoadingWheel />) : (
          <>       
            
            <main>
              {React.Children.map(children, child =>
                React.cloneElement(child, { initRole, initFacet, heroData, heroBuilds, buildFinder, heroMatchups })
              )}
            </main>

            <div className='absolute left-0 pt-12 lg:pt-36 z-0'>
              <BottomBar />
            </div>
          </>
        )}

      </div>
    )
  }
}