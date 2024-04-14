import Head from 'next/head';
import TopBar from './TopBar';

const Layout = ({children}) => {
  return (
    <div className="layout">
      <Head>
        <title>DotaM</title>
        <meta name="description" 
          content="Dota 2 tier lists, hero builds, and matchups. Our information is based on extensive analysis of all matches played, sourced directly from Stratz and OpenDota. Designed to make playing Dota 2 more accessible to beginners, veterans, and even League players!" />
        <meta name="keywords"
          content="Dota 2, Tier List, Tier, Best Heroes, Best Hero, dota, gg, builds, neutral, neutrals, matchups, dota basics, dota explained" />
      </Head>
      <TopBar />
      <main>{children}</main>
      
    </div>
  );
};

export default Layout;
