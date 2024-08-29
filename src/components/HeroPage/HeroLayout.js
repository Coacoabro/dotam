import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import StaticInfo from '../HeroPage/Static/StaticInfo'
import RatesContainer from './Variable/Rates/RatesContainer';

export default function HeroLayout({ hero, info, rates }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
      const handleStart = () => {
      setIsLoading(true);
      };

      const handleComplete = () => {
      setIsLoading(false);
      };

      router.events.on('routeChangeStart', handleStart);
      router.events.on('routeChangeComplete', handleComplete);
      router.events.on('routeChangeError', handleComplete);

      return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      };
  }, [router]);

  const heroData = info[0]
  const heroName = hero.name

  const highestPickRateRole = rates
    .filter(rate => rate.role !== "" && rate.rank == "")
    .reduce((max, rate) => rate.pickrate > max.pickrate ? rate : max, {pickrate: 0});
  
  const initialRole = highestPickRateRole.role

  if(isLoading) {
    return(<div>Loading...</div>)
  }
  else if(heroData){
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

        <RatesContainer rates={rates}  />

      </div>
    )
  }
  else{null}

}