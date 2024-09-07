import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Analytics } from "@vercel/analytics/react"

import IoLoading from './IoLoading'
import Head from 'next/head'
import BottomBar from './BottomBar';
import TopBar from './TopBar';


export default function Layout({children}) {

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {

    const handleStart = (url) => {
      if(!url.includes('=')){
        setIsLoading(true)
      }
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
          <footer className={`${isLoading || router.pathname.includes('/hero/') || router.pathname == '/tier-list' ? 'hidden' : ''} pt-12 lg:pt-56 z-0`}><BottomBar /></footer>
          <Analytics />
    </div>
  );
};
