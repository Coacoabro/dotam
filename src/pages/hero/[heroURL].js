import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import StaticHeroInfo from '../../components/HeroPage/StaticHeroInfo'
import VariableHeroInfo from '../../components/HeroPage/VariableHeroInfo';
import RatesContainer from '../../components/HeroPage/RatesContainer';

import heroName from '../../../dotaconstants/build/heroes.json'

import { Pool } from 'pg';

export const metadata = {
  title: 'DotaM - Hero Page',
  description: 'Hero page with detailed information on abilities, talents, items, and more',
}

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
  client.release();

  return {
    props: {
      hero: res1.rows,
      rates: res2.rows,
      builds: res3.rows,
      abilities: res4.rows
    }
  };
}


function HeroPage({ hero, rates, builds, abilities }) {

  const router = useRouter();

  const highestPickRateRole = rates
    .filter(rate => rate.role !== "" && rate.rank == "")
    .reduce((max, rate) => rate.pickrate > max.pickrate ? rate : max, {pickrate: 0});
  
  const heroData = hero[0]

  const Role = [
    {role: "", name: "All", icon: "../icons8-product-90.png"},
    {role: "POSITION_1", name: "Safe", icon: "../Safe-Lane.png"},
    {role: "POSITION_2", name: "Mid", icon: "../Mid-Lane.png"},
    {role: "POSITION_3", name: "Off", icon: "../Off-Lane.png"},
    {role: "POSITION_4", name: "Soft", icon: "../Soft-Support.png"},
    {role: "POSITION_5", name: "Hard", icon: "../Hard-Support.png"},
  ]

  const Rank = [
    {rank: "", name: "All", icon: "../icons8-competitive-64.png"},
    {rank: "HERALD", name: "Herald", icon: "../dota_ranks/Herald.png"},
    {rank: "GUARDIAN", name: "Guardian", icon: "../dota_ranks/Guardian.png"},
    {rank: "CRUSADER", name: "Crusader", icon: "../dota_ranks/Crusader.png"},
    {rank: "ARCHON", name: "Archon", icon: "../dota_ranks/Archon.png"},
    {rank: "LEGEND", name: "Legend", icon: "../dota_ranks/Legend.png"},
    {rank: "ANCIENT", name: "Ancient", icon: "../dota_ranks/Ancient.png"},
    {rank: "DIVINE", name: "Divine", icon: "../dota_ranks/Divine.png"},
    {rank: "IMMORTAL", name: "Immortal", icon: "../dota_ranks/Immortal.png"},
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
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex p-3">
          <img className="w-64 h-36" src={img} alt={heroName} />
          <StaticHeroInfo heroData={heroData}/>
        </div>
        <div className="flex justify-between px-10">
          <div className='text-center p-2 flex items-center'>
            <button 
              className='text-white bold text-xl space-x-2'
              onMouseEnter={() => setShowRoleInfo(true)}
              onMouseLeave={() => setShowRoleInfo(false)}
              onClick={handleRoleInfoClick}
            >
              ⓘ
            </button>
            {showRoleInfo && (
              <div className="absolute mt-16 bg-gray-700 text-white p-2 rounded-md text-left">
                Hero Role Info
              </div>
            )}

            <div className="p-2 flex space-x-2 text-white">
              {Role.map((role, index) => (
                <button 
                  key={index} 
                  className={`w-10 h-10 border rounded-md hover:bg-blue-200 ${role.role === currentRole ? 'bg-blue-300' : ''} `}
                  onClick={() => handleRoleClick(role.role)}
                  title={role.name}
                >
                  <img src={role.icon} alt={role.name} />
                  {role.name}
                </button>
              ))}
            </div>
          </div>
          <div className='text-center p-2 flex'>
            <button 
              className='text-white bold text-xl space-x-2'
              onMouseEnter={() => setShowRankInfo(true)}
              onMouseLeave={() => setShowRankInfo(false)}
              onClick={handleRankInfoClick}
            >
              ⓘ
            </button>
            {showRankInfo && (
              <div className="absolute mt-10 bg-gray-700 text-white p-2 rounded-md text-left">
                Hero Rank Info
              </div>
            )}
            <div className="p-2 flex space-x-2 rounded-md">
              {Rank.map((rank, index) => (
                <button 
                  key={index} 
                  className={`w-10 h-10 rounded-md border hover:bg-blue-200 ${rank.rank === currentRank ? 'bg-blue-300' : ''} `} 
                  onClick={() => handleRankClick(rank.rank)}
                  title={rank.name}
                >
                  <img src={rank.icon} alt={rank.name}/>
                </button>
              ))}
            </div>
          </div>
        </div>

        <RatesContainer rates = {rates} rank={currentRank} role={currentRole} />
        
        
        <div className="p-1">
          <VariableHeroInfo heroID={heroID} rank={currentRank} role={currentRole} builds={builds} abilities={abilities} />
        </div>
      </div>
    );
  }

  
}

export default HeroPage;
