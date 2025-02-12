import Head from 'next/head'
import Script from 'next/script';

import Heroes from '../components/Home/Heroes'
import SearchBar from '../components/SearchBar'

import Ad from '../components/Ads/Venatus/Ad';

import VerticalAd from '../components/Ads/Venatus/VerticalAd';
import SquareAd from '../components/Ads/Venatus/SquareAd';
import BottomBarAd from '../components/Ads/Venatus/BottomBarAd';
import MobileAd from '../components/Ads/Venatus/MobileAd'
import SideVideoAd from '../components/Ads/Venatus/SideVideoAd';

export default function HeroesPage() {
  return (
    <div>

      <Head>
        <title>Dota 2 All Heroes</title>
        <meta name="description" 
          content="All heroes in Dota 2 listed by attribute" />
        <meta name="keywords"
          content="Dota 2, all heroes, dota hero, all dota 2 heroes" />
        <meta name="google-adsense-account"
          content="ca-pub-2521697717608899" />
        <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
      </Head>

      <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899" 
          crossOrigin="anonymous"
      />

      <div className='sm:py-10 space-y-4 sm:space-y-10'>
        <div className="text-xl sm:text-3xl sm:text-center font-semibold px-3">Dota 2 All Heroes</div>
        <div className='z-0'><Heroes /></div>
      </div>

      {/* <VerticalAd />
      <BottomBarAd />
      <SquareAd />
      <SideVideoAd /> */}


      {/* Google Ad Sense
      <VerticalAd slot="1862440721" />
      <SquareAd slot="4321212989" />

      <div className='mx-auto'>
        <BottomBarAd slot="2656647645" />
        <MobileAd slot="3116583158" />
      </div> */}

    </div>
  );
}