import Head from 'next/head'

import Heroes from '../components/Home/Heroes'
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
        <meta name="google-adsense-account"
          content="ca-pub-2521697717608899" />
        <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899"
          crossorigin="anonymous"></script>
      </Head>
      <div className='sm:py-10 space-y-4 sm:space-y-10'>
        <div className="text-xl sm:text-3xl sm:text-center font-semibold px-3">Dota 2 All Heroes</div>
        <div className='z-0'><Heroes /></div>
      </div>
    </div>
  );
}