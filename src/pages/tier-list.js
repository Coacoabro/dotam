import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Rank from '../components/Rank'
import Role from '../components/Role'
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
  const { role, rank } = router.query  

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

    if(role){
      currentRole = role
    }
    if(rank){
      currentRank = rank
    }

    setCounters(matchups.filter(r => r.rank.includes(currentRank)))  

    if (currentRole) {
      heroesByRR = rates.filter(r => r.rank === currentRank && r.role === currentRole && r.pickrate >= 0.005)
    } else {heroesByRR = rates.filter(r => r.rank === currentRank && r.pickrate >= 0.005)}
    
    if (sortBy === "f2l") {
      setTierList(heroesByRR.sort((a, b) => b[currentSort] - a[currentSort]))
    }
    else if (sortBy === "l2f") {
      setTierList(heroesByRR.sort((a, b) => a[currentSort] - b[currentSort]))
    }

  }, [rates, matchups, rank, role, currentSort, sortBy]);

  return (
    <div>

      <Head>
        <title>Dota 2 Tier Lists</title>
        <meta name="description" 
          content="Dota 2 tier list based on current win rates and pick rates from almost all games played within the current patch" />
        <meta name="keywords"
          content="Dota 2, Tier List, Tier, Best Heroes, Best Hero, dota, gg" />
        <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 space-y-4 text-white pt-8">
        <div className="text-3xl py-4 font-semibold">Dota 2 Tier List</div>
        <div className="text-xl text-gray-300 py-1">A tier list based on current win rates and pick rates from almost all games played within the current patch</div>
        <div className="py-2 md:flex md:justify-between text-white">
          <div className="flex items-center space-x-2">
            {/* <Info data="Role" /> */}
            <Role />
          </div>
          <div class="flex items-center space-x-2">
            {/* <Info data="Rank" /> */}
            <Rank />
          </div>
        </div>

        <div className="overflow-x-auto bg-slate-950 rounded-lg shadow border border-slate-800">
          <table className="table-auto w-full text-slate-200 font-medium font-['Inter'] font-sans leading-tight">
            <thead>
              <tr className="bg-slate-950 text-white text-lg text-center">
                <th className="px-6 py-2">
                  <button className='flex items-center space-x-1' onClick={() => handleSortClick("tier_num", currentSort)}>
                    <div>TIER</div>
                    <img src="UpDown.svg" />
                  </button>
                </th>
                <th className=" py-2">
                  HERO
                </th>
                <th className="px-1 py-2">
                  ROLE
                </th>
                <th className="px-6 py-2">
                  <button className='flex items-center space-x-1' onClick={() => handleSortClick("winrate", currentSort)}>
                    <div>WR</div>
                    <img src="UpDown.svg" />
                  </button>
                </th>
                <th className="px-10 py-2">
                  <button className='flex items-center space-x-1' onClick={() => handleSortClick("pickrate", currentSort)}>
                    <div>PR</div>
                    <img src="UpDown.svg" />
                  </button>
                </th>
                <th className="px-10 py-2">
                  COUNTERS
                </th>
                <th className="px-2 py-2">
                  <button className='flex items-center space-x-1' onClick={() => handleSortClick("matches", currentSort)}>
                    <div>MATCHES</div>
                    <img src="UpDown.svg" />
                  </button>
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

