import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import TierCard from '../components/TierList/TierCard'

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
  const res1 = await client.query('SELECT * FROM heroes');
  const res2 = await client.query('SELECT * FROM rates');
  client.release();

  return {
    props: {
      heroes: res1.rows,
      rates: res2.rows
    }
  };
}

function TierList({ heroes, rates }) {

  const router = useRouter();


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

  const [currentRole, setCurrentRole] = useState("");
  const handleRoleClick = (role) => {
    setCurrentRole(role);
  };

  const [currentRank, setCurrentRank] = useState("");
  const handleRankClick = (rank) => {
    setCurrentRank(rank);
  };

  const [currentSort, setCurrentSort] = useState("tier_num");
  const [sortBy, setSortBy] = useState("f2l");
  const handleSortClick = (sort) => {
    setCurrentSort(sort);
    if (sortBy === "f2l") {
      setSortBy("l2f")
    } else if (sortBy === "l2f") {
      setSortBy("f2l")
    }
  };

  const [tierList, setTierList] = useState([{}]);

  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const handleRoleInfoClick = () => {
    router.push('/basics')
  }
  const [showRankInfo, setShowRankInfo] = useState(false);
  const handleRankInfoClick = () => {
    router.push('/basics')
  }

  useEffect(() => {
    let heroesByRR = [];

    if (currentRole) {
      heroesByRR = rates.filter(r => r.rank === currentRank && r.role === currentRole && r.pickrate >= 0.0005)
    }
    else {
      heroesByRR = rates.filter(r => r.rank === currentRank && r.role === currentRole)
    }

    if (sortBy === "f2l") {
      setTierList(heroesByRR.sort((a, b) => b[currentSort] - a[currentSort]))
    }
    else if (sortBy === "l2f") {
      setTierList(heroesByRR.sort((a, b) => a[currentSort] - b[currentSort]))
    }
    

  }, [rates, currentRank, currentRole, currentSort, sortBy]);


  return (
    <div className="max-w-6xl mx-auto px-4 space-y-4">
      <div className="text-xl text-white text-center py-2">Dota 2 Tier List</div>
      <div className="text-md text-white text-center py-2">This tier list is based on current statistical data from almost all games played within the current patch</div>
      <div className="flex space-x-20 px-10 text-white">
        <div class="flex">
          <button 
            className='text-white bold text-xl space-x-2'
            onMouseEnter={() => setShowRoleInfo(true)}
            onMouseLeave={() => setShowRoleInfo(false)}
            onClick={handleRoleInfoClick}
          >
            ⓘ
          </button>
          {showRoleInfo && (
            <div className="absolute mt-10 bg-gray-700 text-white p-2 rounded-md text-left">
              Hero Role Info
            </div>
          )}
          <div className="p-2 flex space-x-2 rounded-md">
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
        <div class="flex">
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
                className={`w-10 h-10 border rounded-md hover:bg-blue-200 ${rank.rank === currentRank ? 'bg-blue-300' : ''} `} 
                onClick={() => handleRankClick(rank.rank)}
                title={rank.name}
              >
                <img src={rank.icon} alt={rank.name}/>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-md p-2">
          <button className="w-10 h-10 rounded-md border text-white text-xs p-1">7.34e</button>
        </div>
      </div>

      <div className="p-2 space-y-3 rounded-md bg-gray-700">
          <h1 className="flex text-white text-2xl underline">
            <button className="px-5" onClick={() => handleSortClick("tier_num")}>TIER</button>
            <button className="px-40" onClick={() => handleSortClick("hero_id")}>HERO</button>
            <button className="px-10" onClick={() => handleSortClick("winrate")}>WR</button>
            <button className="px-12" onClick={() => handleSortClick("pickrate")}>PR</button>
            <button className="px-6" onClick={() => handleSortClick("matches")}>MATCHES</button>
            <button className="px-10" onClick={() => handleSortClick("tier_num")}>MATCHUPS</button>
          </h1>
          <div className="space-y-2">
          { 
            tierList.map((tierItem, index) => (
              <div className={index % 2 === 0 ? 'bg-gray-800 rounded-md' : ''}>
                <TierCard
                  tier_str={tierItem.tier_str}
                  hero={heroes.find(hero => hero.hero_id === tierItem.hero_id)}
                  WR={tierItem.winrate}
                  PR={tierItem.pickrate}
                  matches={tierItem.matches}
                />
              </div>
            ))
          }
          </div>
          
          
          
          
      </div>
      
    </div>
    
  );
}

export default TierList;
