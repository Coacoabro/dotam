import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'

import Head from 'next/head'
import Hero from '../components/Home/Hero'
import Heroes from '../components/Home/Heroes'
import SearchBar from '../components/SearchBar'
import HorizontalAd from '../components/Ads/Google/HorizontalAd'
import VerticalAd from '../components/Ads/Google/VerticalAd'
import SquareAd from '../components/Ads/Google/SquareAd'


export default function Home() {

    const router = useRouter()

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {

        if (router.asPath.includes('#')) {
            setScrollY(1)
            const elementId = router.asPath.split('#')[1];
            const element = document.getElementById(elementId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }

          }

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [router.asPath]);
    
    return(
        <div className='flex flex-col relative min-h-screen'>

            <Head>
                <title>DotaM: Dota 2 Builds Tier Lists and Basics</title>
                <meta name="description" 
                    content="DotaM looks at the current Dota 2 Meta and showcases it in a clean accessible way!" />
                <meta name="keywords"
                    content="Dota 2, Tier List, Tier, Best Heroes, Best Hero, dota, gg, builds, neutral, neutrals, matchups, dota basics, dota explained" />
                <meta name="google-adsense-account"
                    content="ca-pub-2521697717608899" />
                <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
            </Head>

            <Script 
                async 
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899" 
                crossOrigin="anonymous"
            />

            <div className='fixed top-1/4 left-4'>
                <VerticalAd slot="7985255708" />
            </div>


            <div className="flex top-[5vh] sm:top-[20vh] justify-center items-center relative z-10" >
                <Hero />
            </div>

            <div id="heroes" className="flex top-[10vh] sm:top-[22.5vh] justify-center items-center relative py-4 space-x-1 sm:text-lg">
                <div>Data powered by</div>
                <a className="font-bold flex space-x-1 items-center text-[#0994af]" href="https://www.stratz.com" target="_blank"> <img src="/StratzLogo.svg" className='w-8 h-8'/>Stratz</a>
                {/* <div>and</div>
                <a className="font-bold flex space-x-1 items-center text-indigo-200" href="https://www.opendota.com" target="_blank"> <img src="/OpenDotaLogo.png" className='w-8 h-8'/>OpenDota</a> */}
            </div>

            <div className={`relative top-[15vh] sm:top-[25vh] filter transition-all top-3/4 duration-500 ease-in-out z-0 space-y-8`}>
                <HorizontalAd slot="1909967797" />
                <Heroes scrollY={scrollY}/>
            </div>

            <div className='fixed top-1/4 right-4'>
                <SquareAd slot="3693391551" />
            </div>
        </div>
    )
}