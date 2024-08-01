import Head from 'next/head'
import BottomBar from './BottomBar';
import TopBar from './TopBar';
import { Analytics } from "@vercel/analytics/react"

export default function Layout({children}) {
  return (
    <div className="layout">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header className='z-10'><TopBar /></header>
      <main className='pt-24 z-20'>{children}</main>
      <footer className='bottom-0 pt-12 sm:pt-56 z-0'><BottomBar /></footer>
      <Analytics />
    </div>
  );
};
