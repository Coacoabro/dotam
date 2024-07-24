import Head from 'next/head'

import Heroes from '../components/Home/Heroes';
import SearchBar from '../components/SearchBar'

export default function HeroesPage() {
  return (
    <div>
      <Head>
        <title>Dota 2 All Heroes</title>
        <meta name="description" 
          content="All heroes in Dota 2 listed by attribute" />
        <meta name="keywords"
          content="Dota 2, all heroes, dota hero, all dota 2 heroes" />
        <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
      </Head>
      <div className='sm:py-10 space-y-4 sm:space-y-10 z-0 px-1'>
        <div className="text-xl sm:text-3xl sm:text-center font-semibold px-3">Dota 2 All Heroes</div>
        <div className='hidden sm:block'><SearchBar /></div>
        <Heroes />
      </div>
    </div>
  );
}