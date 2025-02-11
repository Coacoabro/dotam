import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Analytics } from "@vercel/analytics/react"

import IoLoading from './IoLoading'
import Head from 'next/head'
import BottomBar from './BottomBar';
import TopBar from './TopBar';
import BottomBarAd from './Ads/Google/BottomBarAd';
import HorizontalAd from './Ads/Google/HorizontalAd';


export default function Layout({ children }) {

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const path = router.asPath
  const [route, setRoute] = useState(router.pathname.split('/')[1])

  useEffect(() => {

    const handleStart = (url) => {
      if (!url.includes(route)) {
        setRoute(router.pathname.split('/')[1])
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
    <div className="layout overflow-x-hidden overflow-y-hidden">
      
      <Head>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Venatus Ad Manager */}

        <script src="https://hb.vntsm.com/v4/live/vms/sites/dotam.gg/index.js" async></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            self.__VM = self.__VM || [];
            self.__VM.push(function (admanager, scope) {
              scope.Config.get('billboard').display('slot-1');
              scope.Config.get('leaderboard').display('slot-2');
              scope.Config.get('mobile_banner').display('slot-3');
              scope.Config.get('mobile_mpu').display('slot-4');
              scope.Config.get('mpu').display('slot-5');
              scope.Config.get('skyscraper').display('slot-6');
              scope.Config.get('double_mpu').display('slot-7');
              scope.Config.get('desktop_takeover').display('slot-8');
              scope.Config.get('mobile_takeover').display('slot-9');
              scope.Config.get('video').display('slot-10');
            });
            `,
          }}
        />

        {/* Google Ad Manager */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GE9JHJJ3ZR"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GE9JHJJ3ZR');
            `,
          }}
        ></script>
        


      </Head>

      <header className='z-10'>
        <TopBar />
      </header>

      {isLoading ? (<IoLoading />) : (<main className='pt-24 z-20'>{children}</main>)}

      <footer className={`${isLoading || router.pathname.includes('/hero/') || router.pathname == '/tier-list' || router.pathname.includes('/basics/') ? 'hidden' : ''} ${router.asPath == '/' ? 'pt-24 lg:pt-[400px]' : 'pt-12 lg:pt-24'}  z-0`}>
        <BottomBar />
      </footer>
      
      <Analytics />

    </div>
  );
};
