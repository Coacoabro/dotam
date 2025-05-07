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
import PagesList from '../../PagesList';
import HeroLoading from './HeroLoading';

import Ad from '../../../components/Ads/Venatus/Ad';

const fetchHeroData = async (hero, type, rank, role, patch, facet, page) => {
  const response = await fetch(`/api/${hero}?type=${type}&rank=${rank}&role=${role}&patch=${patch}&facet=${facet}&page=${page}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export default function HeroLayout({ children, hero, heroInfo, current_patch, page, rates, summary, initRole, initFacet }) {

  const router = useRouter()
  const {rank, role, patch, facet} = router.query

  const [currRank, setCurrRank] = useState(rank || "")
  const [currRole, setCurrRole] = useState(role || initRole)
  const [currPatch, setCurrPatch] = useState(patch || current_patch)
  const [currFacet, setCurrFacet] = useState(facet || initFacet)

  const [currRates, setCurrRates] = useState(null)

  const { data: heroBuilds, isLoading: buildsLoading } = useQuery(['heroData', hero.id, 'page', currRank, currRole, currPatch, currFacet, page], () => fetchHeroData(hero.id, 'page', currRank, currRole, currPatch, currFacet, page), {staleTime: 3600000});
  const { data: heroMatchups, isLoading: matchupsLoading } = useQuery(['heroData', hero.id, 'matchups', currRank, currRole, currPatch, currFacet], () => fetchHeroData(hero.id, 'matchups', currRank, currRole, currPatch, currFacet), {staleTime: 3600000});

  useEffect(() => {
    if(rank){setCurrRank(rank)}
    if(role){setCurrRole(role)}
    if(patch){setCurrPatch(patch)}
    if(facet){setCurrFacet(facet)}

    if(rates){
      if(role){
        setCurrRates(rates.find(rate => rate.role == role))
      }
      else {
        setCurrRates(rates.find(rate => rate.role == initRole))
      }
    }

  }, [rank, role, patch, facet, rates])

  if(rates){

    if( buildsLoading || matchupsLoading ){
      if(heroInfo){
        return(<HeroLoading hero={hero} heroData={heroInfo} rates={currRates} current_patch={current_patch} initRole={initRole} initFacet={initFacet} />)
      }
    }

    else{

      if(heroInfo){

        const heroData = heroInfo
        const heroName = hero.name    

        let currBuild = null

        const portrait = 'https://cdn.cloudflare.steamstatic.com' + heroData.img
        const crop_img = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/' + heroData.name.replace('npc_dota_hero_', '') + '.png'
        const hero_vid = 'https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/' + heroData.name.replace('npc_dota_hero_', '') + '.webm'

        if(heroBuilds){currBuild = heroBuilds[currRole][currFacet]}

        return(
          <div>
            <div className="px-1 sm:px-4 sm:mx-auto sm:max-w-7xl space-y-2 sm:space-y-0">
              
              <div className="pt-2 flex justify-center align-items-center h-24" >
                <Ad placementName="leaderboard" />
              </div>
              

              <div className="flex relative items-end sm:items-center gap-1 sm:gap-4">

                <img src={portrait} className="h-14 sm:h-32" />

                <div className="sm:py-7 sm:px-2 flex-col space-y-2 z-20 sm:z-40">
                  <div className="text-2xl sm:text-5xl font-bold ml-2">{heroName}</div>
                  <div className="hidden sm:block"><StaticInfo hero={heroData} /></div>
                </div>

                <div className="hidden sm:flex absolute right-0 mt-24 h-72 opacity-25 z-0">
                  <img src={crop_img} className="object-cover w-full h-full" />
                </div>

              </div>

              <div className="sm:hidden absolute h-36 right-0 top-20 opacity-25">
                <img src={crop_img} className="object-cover w-full h-full" />
              </div>

              <div className="block sm:hidden z-10">
                <StaticInfo hero={heroData} />
              </div>

              <div className='flex space-x-3'>
                <RatesContainer rates={currRates} initRole={initRole} current_patch={current_patch} />
                <div className='hidden sm:block space-y-3'>
                  <h1 className='font-bold px-2 pb-2 text-lg'>More Info:</h1>
                  <PagesList hero={hero.url} />
                  {/* <Pages hero={hero.url} /> */}
                </div>
              </div>

              <div className="pt-2 flex justify-center align-items-center" >
                <Ad placementName="mobile_banner" />
              </div>

              <div className='py-3 z-0 px-0 sm:px-32 lg:px-0'>
                <OptionsContainer hero={hero} initRole={initRole} initFacet={initFacet} hero_name={heroData.name} summary={summary} />
              </div>

              {currBuild ?
                <main>
                  {React.Children.map(children, child =>
                    React.cloneElement(child, { initRole, initFacet, heroData, currBuild, heroMatchups })
                  )}
                </main>
              : heroMatchups ? 
                <main>
                  {React.Children.map(children, child =>
                    React.cloneElement(child, { heroData, initRole, heroMatchups })
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
  }
}