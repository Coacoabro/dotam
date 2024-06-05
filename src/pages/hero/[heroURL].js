import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';

import StaticHeroInfo from '../../components/HeroPage/StaticHeroInfo'
import VariableHeroInfo from '../../components/HeroPage/VariableHeroInfo';
import RatesContainer from '../../components/HeroPage/RatesContainer';

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getServerSideProps(context) {

  const heroId = context.query.heroURL;

  const client = await pool.connect();
  const res1 = await client.query('SELECT * FROM heroes WHERE hero_id = $1', [heroId]);
  const res2 = await client.query('SELECT * FROM rates WHERE hero_id = $1', [heroId]);
  const res3 = await client.query('SELECT * FROM builds WHERE hero_id = $1', [heroId]);
  const res4 = await client.query('SELECT * FROM abilities WHERE hero_id = $1', [heroId]);
  const res5 = await client.query('SELECT * FROM items WHERE hero_id = $1', [heroId]);
  const res6 = await client.query('SELECT * FROM matchups WHERE hero_id = $1', [heroId]);
  client.release();

  return {
    props: {
      hero: res1.rows,
      rates: res2.rows,
      builds: res3.rows,
      abilities: res4.rows,
      items: res5.rows,
      matchups: res6.rows
    }
  };
}


function HeroPage({ hero, rates, builds, abilities, items, matchups }) {

  const router = useRouter();

  const highestPickRateRole = rates
    .filter(rate => rate.role !== "" && rate.rank == "")
    .reduce((max, rate) => rate.pickrate > max.pickrate ? rate : max, {pickrate: 0});
  
  const heroData = hero[0]

  const Role = [
    {role: "POSITION_1", name: "Safe Lane", icon: "../Safe-Lane.png"},
    {role: "POSITION_2", name: "Mid Lane", icon: "../Mid-Lane.png"},
    {role: "POSITION_3", name: "Off Lane", icon: "../Off-Lane.png"},
    {role: "POSITION_4", name: "Soft Support", icon: "../Soft-Support.png"},
    {role: "POSITION_5", name: "Hard Support", icon: "../Hard-Support.png"},
  ]

  const Rank = [
    {rank: "", name: "All", icon: "../icons8-competitive-64.png"},
    {rank: "IMMORTAL", name: "Immortal", icon: "../dota_ranks/Immortal.png"},
    {rank: "DIVINE", name: "Divine", icon: "../dota_ranks/Divine.png"},
    {rank: "ANCIENT", name: "Ancient", icon: "../dota_ranks/Ancient.png"},
    {rank: "LEGEND", name: "Legend", icon: "../dota_ranks/Legend.png"},
    {rank: "ARCHON", name: "Archon", icon: "../dota_ranks/Archon.png"},
    {rank: "CRUSADER", name: "Crusader", icon: "../dota_ranks/Crusader.png"},
    {rank: "GUARDIAN", name: "Guardian", icon: "../dota_ranks/Guardian.png"},
    {rank: "HERALD", name: "Herald", icon: "../dota_ranks/Herald.png"},
  ]

  const [currentRole, setCurrentRole] = useState(highestPickRateRole.role);
  const handleRoleClick = (role) => {
    setCurrentRole(role);
  };
  const [currentRank, setCurrentRank] = useState("");
  const handleRankClick = (rank) => {
    setCurrentRank(rank);
  };  

  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const handleRoleInfoClick = () => {
    router.push('/basics')
  }
  const [showRankInfo, setShowRankInfo] = useState(false);
  const handleRankInfoClick = () => {
    router.push('/basics')
  }

  if (!heroData) {
    return;
  }

  else {
    
    const heroName = heroData.localized_name
    const heroID = heroData.hero_id

    const img = 'https://cdn.cloudflare.steamstatic.com' + heroData.img

    const crop_img = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/crops/' + heroData.name.replace('npc_dota_hero_', '') + '.png'

    return (
      <div>
        <Head>
          <title>{heroName} Guide: Builds, Matchups, and Rates</title>
          <meta name="description" 
            content={`Highest win rate builds for ${heroName}. See where they fit in the meta through DotaM's tiering system.`} />
          <meta name="keywords"
            content={`${heroName}, builds, neutral, neutrals, matchups`} />
          <link rel="icon" href="../images/favicon.ico" type="image/x-icon" />
        </Head>
        <div className="p-4 max-w-7xl mx-auto">
          <div>
            <div className="flex p-3">
              <img className="w-64 h-36" src={img} alt={heroName} />
              <StaticHeroInfo heroData={heroData}/>
              {/* <img className="w-64 h-40 opacity-50" src={crop_img} alt={heroName} /> */}
            </div>
            <div className="md:flex justify-evenly md:px-10">
              <div className='text-center p-2 flex items-center'>
                <button 
                  className='text-black text-xl space-x-2'
                  onMouseEnter={() => setShowRoleInfo(true)}
                  onMouseLeave={() => setShowRoleInfo(false)}
                  onClick={handleRoleInfoClick}
                >
                  ⓘ
                </button>
                {showRoleInfo && (
                  <div className="absolute mt-16 bg-gray-800 text-white p-2 rounded-md text-left">
                    Hero Role Info
                  </div>
                )}

                <div className="p-2 flex space-x-2 text-white">
                  {Role.map((role, index) => (
                    <button 
                      key={index} 
                      className={`w-10 h-10 rounded-md hover:bg-blue-400 ${role.role === currentRole ? 'bg-blue-600' : 'bg-gray-800'} `}
                      onClick={() => handleRoleClick(role.role)}
                      title={role.name}
                    >
                      <img src={role.icon} alt={role.name} />
                    </button>
                  ))}
                </div>
              </div>
              <div className='text-center space-x-2 items-center p-2 flex'>
                <button 
                  className='text-black text-xl space-x-2'
                  onMouseEnter={() => setShowRankInfo(true)}
                  onMouseLeave={() => setShowRankInfo(false)}
                  onClick={handleRankInfoClick}
                >
                  ⓘ
                </button>
                {showRankInfo && (
                  <div className="absolute mt-10 bg-gray-800 text-white p-2 rounded-md text-left">
                    Hero Rank Info
                  </div>
                )}
                <form className="max-w-sm mx-auto w-36">
                  <select 
                    className="bg-gray-800 text-white text-lg rounded-lg block w-full p-2.5"
                    value={currentRank}  
                    onChange={(e) => handleRankClick(e.target.value)}
                  >
                    {Rank.map((rank, index) => (
                      <option
                        key={index}
                        value={rank.rank}
                      >
                        {rank.name}
                      </option>
                    ))}
                  </select>
                </form>
              </div>
            </div>

            <RatesContainer rates = {rates} rank={currentRank} role={currentRole} />
          </div>
          
          <div className="p-1">
            <VariableHeroInfo heroID={heroID} rank={currentRank} role={currentRole} builds={builds} abilities={abilities} items={items} matchups={matchups} />
          </div>
        </div>
      </div>
    );
  }

  
}

export default HeroPage;
