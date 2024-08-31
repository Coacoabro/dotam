import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Analytics } from "@vercel/analytics/react"

import IoLoading from './IoLoading'
import Head from 'next/head'
import BottomBar from './BottomBar';
import TopBar from './TopBar';


export default function Layout({children}) {

  const [isLoading, setIsLoading] = useState(false);
  const [currHero, setCurrHero] = useState(false)
  const router = useRouter();

  useEffect(() => {

    if(router.pathname.includes('/hero/')){
      setCurrHero(true)
    }

    const handleStart = (url) => {
      if(!currHero || (currHero && !url.includes('/hero/'))){
        setIsLoading(true)
      }
    };

    const handleComplete = () => {
      setIsLoading(false);
      setCurrHero(false)
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router, currHero]);

  console.log(currHero)

  return (
        <div className="layout">
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </Head>
          <header className='z-10'><TopBar /></header>
          {isLoading ? (
            <IoLoading />
          ) 
          : 
          (<main className='pt-24 z-20'>{children}</main>)}
          <footer className={`${isLoading ? 'hidden' : ''} bottom-0 pt-12 lg:pt-56 z-0`}><BottomBar /></footer>
          <Analytics />
    </div>
  );
};
