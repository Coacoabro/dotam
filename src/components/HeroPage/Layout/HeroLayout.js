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
import Pages from '../../Pages';
import HeroLoading from './HeroLoading';
import HorizontalAd from '../../Ads/Google/HorizontalAd';

const fetchHeroData = async (hero, type, patch, page) => {
  const response = await fetch(`/api/${hero}?type=${type}&patch=${patch}&page=${page}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function HeroLayout({ children, hero, current_patch, page, rates, initRole }) {

  const router = useRouter()
  const {rank, role, patch, facet} = router.query

  const [currPatch, setCurrPatch] = useState(patch || current_patch)

  const { data: heroInfo, isLoading: infoLoading } = useQuery(['heroData', hero.id, 'info', currPatch], () => fetchHeroData(hero.id, 'info', currPatch), {staleTime: 3600000});
  const { data: heroBuilds, isLoading: buildsLoading } = useQuery(['heroData', hero.id, 'page', currPatch, page], () => fetchHeroData(hero.id, 'page', currPatch, page), {staleTime: 3600000});
  const { data: heroMatchups, isLoading: matchupsLoading } = useQuery(['heroData', hero.id, 'matchups', currPatch], () => fetchHeroData(hero.id, 'matchups', currPatch), {staleTime: 3600000});

  useEffect(() => {
    if(patch){setCurrPatch(patch)}
  }, [patch])

  if( buildsLoading || matchupsLoading ){
    if(heroInfo){
      return(<HeroLoading hero={hero} heroData={heroInfo} rates={rates} current_patch={current_patch} initRole={initRole} />)
    }
    else{return(<IoLoading />)}
  }
  else{

    const heroData = heroInfo

    const heroName = hero.name    

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
      else return 'blank'
    })();

    const portrait = 'https://cdn.cloudflare.steamstatic.com' + heroData.img
    const crop_img = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/' + heroData.name.replace('npc_dota_hero_', '') + '.png'
    const hero_vid = 'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/' + heroData.name.replace('npc_dota_hero_', '') + '.webm'

    return(
      <div>
        <div className="px-1 sm:px-4 sm:pt-14 sm:mx-auto sm:max-w-7xl space-y-2 sm:space-y-0">

          <div className="flex relative items-end sm:items-center gap-1 sm:gap-4">

            <img src={portrait} className="h-14 sm:h-32" />

            <div className="sm:py-7 sm:px-2 flex-col space-y-2 z-20 sm:z-40">
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
            {rates.length > 0 ? <RatesContainer rates={rates} initRole={initRole} current_patch={current_patch} /> : null}
            <div className='hidden sm:block'>
              <h1 className='font-bold px-2 pb-2'>More Info:</h1>
              <Pages hero={hero.url} />
            </div>
          </div>

          <div className='py-3 z-0 px-0 sm:px-32 lg:px-0'>
            <OptionsContainer hero={hero} initRole={initRole} initFacet={initFacet} hero_name={heroData.name} />
          </div>

          {heroBuilds ?
            <main>
              {React.Children.map(children, child =>
                React.cloneElement(child, { initRole, initFacet, heroData, heroBuilds, heroMatchups })
              )}
            </main>
          : <div>Nothing yet!</div>}

        </div>

        <div className='z-0 mx-auto mt-12'>
          <BottomBar />
        </div>

      </div>
      
    )
  }
}