import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Rank from '../components/Rank'
import Role from '../components/Role'
import Patches from '../components/Patches'
import Info from '../components/Info'

import TierRow from '../components/TierList/TierRow'

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getServerSideProps(context) {

  const client = await pool.connect();
  const res1 = await client.query('SELECT * FROM heroes');
  const res2 = await client.query('SELECT * FROM rates');
  const res3 = await client.query('SELECT hero_id, rank, role, herovs FROM matchups');
  client.release();

  return {
    props: {
      heroes: res1.rows,
      rates: res2.rows,
      matchups: res3.rows
    }
  };
}


export default function TierList({ heroes, rates, matchups }) {

  const router = useRouter();
  const { role, rank, patch } = router.query  

  const [currentSort, setCurrentSort] = useState("tier_num");
  const [sortBy, setSortBy] = useState("f2l");
  const handleSortClick = (sort, currentSort) => {
    if (sort == currentSort) {
      if (sortBy === "f2l") {
        setSortBy("l2f")
      } else if (sortBy === "l2f") {
        setSortBy("f2l")
      }
    }
    else {setCurrentSort(sort)}
  };

  const [tierList, setTierList] = useState([{}]);
  const [counters, setCounters] = useState([])

  useEffect(() => {

    let heroesByRR = [];

    let currentRole = ""
    let currentRank = ""
    let currentPatch = "7.37"

    if(role){
      currentRole = role
    }
    if(rank){
      currentRank = rank
    }
    if(patch != currentPatch){
      currentPatch = patch
    }

    setCounters(matchups.filter(r => r.rank.includes(currentRank)))  

    if (currentRole) {
      heroesByRR = rates.filter(r => r.rank === currentRank && r.role === currentRole && r.patch === currentPatch && r.pickrate >= 0.005)
    } else {heroesByRR = rates.filter(r => r.rank === currentRank && r.patch === currentPatch && r.pickrate >= 0.005)}
    
    if (sortBy === "f2l") {
      setTierList(heroesByRR.sort((a, b) => b[currentSort] - a[currentSort]))
    }
    else if (sortBy === "l2f") {
      setTierList(heroesByRR.sort((a, b) => a[currentSort] - b[currentSort]))
    }

  }, [rates, matchups, rank, role, patch, currentSort, sortBy]);

  return (
    <div>

      <Head>
        <title>Dota 2 Tier Lists</title>
        <meta name="description" 
          content="Dota 2 tier list based on current win rates and pick rates from almost all games played within the current patch" />
        <meta name="keywords"
          content="Dota 2, Tier List, Tier, Best Heroes, Best Hero, dota, gg" />
        <meta name="google-adsense-account"
          content="ca-pub-2521697717608899" />
        <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
      </Head>

      <div className="max-w-7xl mx-auto px-1 sm:px-4 sm:space-y-4 text-white sm:pt-8">
        <div className="text-xl sm:text-3xl px-2 sm:px-0 py-2 sm:py-4 font-semibold">Dota 2 Tier List</div>
        <div className="text-sm sm:text-xl text-gray-300 px-2 sm:px-0 py-1 opacity-50">A tier list based on current win rates and pick rates from almost all games played within the current patch</div>
        <div className="py-2 justify-between text-white space-y-2 sm:flex">
          <div className="flex items-center justify-center space-x-2">
            <Role />
          </div>
          <div class="flex items-center justify-center space-x-2">
            <Patches />
            <Rank />
          </div>
        </div>

        <div className="overflow-x-auto bg-slate-950 rounded-lg shadow border border-slate-800">
          <table className="table-auto w-full text-slate-200 font-medium font-['Inter'] font-sans leading-tight">
            <thead>
              <tr className="bg-slate-950 text-white text-sm sm:text-xl text-center">
                <th className="py-2 px-3 text-center">
                  <button onClick={() => handleSortClick("tier_num", currentSort)}>
                    <div className='flex items-center'>TIER <img src="UpDown.svg" className='w-4 h-4 sm:w-6 sm:h-6' /></div>
                  </button>
                </th>
                <th>
                  HERO
                </th>
                <th className="flex pt-2 px-2 sm:px-0">
                  ROLE
                </th>
                <th className='px-4 sm:px-0'>
                  <button onClick={() => handleSortClick("winrate", currentSort)}>
                    <div className='flex items-center'>WR <img src="UpDown.svg" className='w-4 h-4 sm:w-6 sm:h-6' /></div>
                  </button>
                </th>
                <th className='px-4 sm:px-0'>
                  <button onClick={() => handleSortClick("pickrate", currentSort)}>
                    <div className='flex items-center'>PR <img src="UpDown.svg" className='w-4 h-4 sm:w-6 sm:h-6' /></div>
                  </button>
                </th>
                <th className='px-4 sm:px-0'>
                  <button onClick={() => handleSortClick("matches", currentSort)}>
                    <div className='flex items-center'>MATCHES <img src="UpDown.svg" className='w-4 h-4 sm:w-6 sm:h-6' /></div>
                  </button>
                </th>
                <th className='px-2 hidden lg:flex justify-center'>
                  COUNTERS
                </th>
              </tr>
            </thead>
            <tbody className="text-white text-center">
              {tierList.map((tierItem, index) => {
                return (
                  <TierRow
                      index={index}
                      tier_str={tierItem.tier_str}
                      hero={heroes.find(hero => hero.hero_id === tierItem.hero_id)}
                      role={tierItem.role}
                      WR={tierItem.winrate}
                      PR={tierItem.pickrate}
                      matches={tierItem.matches}
                      counters={counters.find(obj => obj.hero_id === tierItem.hero_id && obj.role === tierItem.role)}
                    />
              )})}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}

