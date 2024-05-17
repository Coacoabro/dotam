import Head from 'next/head';
import SearchBar from '../components/SearchBar';

function Home({ data }) {

  return(
    <div>
      <Head>
        <title>DotaM: Dota 2 Builds Tier Lists and Basics</title>
        <meta name="description" 
          content="Designed to make playing Dota 2 more accessible to beginners, veterans, and even League players!" />
        <meta name="keywords"
          content="Dota 2, Tier List, Tier, Best Heroes, Best Hero, dota, gg, builds, neutral, neutrals, matchups, dota basics, dota explained" />
        <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
      </Head>
      <div className="static h-screen flex justify-center">
        <div>
          {/*<img src="../dota2background.jpg" alt="background" className="blur-sm w-screen" />*/}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-28 flex flex-col items-center">
            <div className='max-w-xl'><img src="../DotamLogoLight.png" /></div>
            <SearchBar />
          </div>
          {/*<div className='absolute bottom-1 left-1/4 -translate-x-1/2 -translate-y-1/2 space-y-2 bg-gray-700 px-4 py-2 rounded-md'>
              <div className="text-center text-white">Powered By:</div>
              <div className="flex justify-between space-x-10 text-white">
                <div className="text-center text-xs">
                  <a href="https://www.stratz.com/api" target="_blank" ><img src="../StratzLogo.png" alt="logo" className="w-12" /></a>
                  Stratz
                </div>
                <div className="text-center flex-bottom justify-center text-xs">
                  <a href="https://www.opendota.com" target="_blank" ><img src="../OpenDotaLogo.png" alt="logo" className="w-12" /></a>
                  OpenDota
                </div>
              </div>
          </div>*/}
        </div>
      </div>
    </div>
    
  )
}

export default Home