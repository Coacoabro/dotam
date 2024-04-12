import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import TierCard from '../components/TierList/TierCard'

import { Pool } from 'pg';

export const metadata = {
  title: 'DotaM - Tier List',
  description: 'Tier list of Dota 2 heroes based on current statistical data from almost all games played within the current patch',
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
  const res1 = await client.query('SELECT * FROM heroes');
  const res2 = await client.query('SELECT * FROM rates');
  const res3 = await client.query('SELECT hero_id, rank, herovs FROM matchups');
  client.release();

  return {
    props: {
      heroes: res1.rows,
      rates: res2.rows,
      matchups: res3.rows
    }
  };
}

function TierList({ heroes, rates, matchups }) {

  const router = useRouter();


  const Role = [
    {role: "", name: "All", icon: "../icons8-product-90.png"},
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
  const [counters, setCounters] = useState([])

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

    setCounters(matchups.filter(r => r.rank === currentRank))  

    if (currentRole) {
      heroesByRR = rates.filter(r => r.rank === currentRank && r.role === currentRole && r.pickrate >= 0.005)
    } else {heroesByRR = rates.filter(r => r.rank === currentRank && r.pickrate >= 0.005)}

    if (sortBy === "f2l") {
      setTierList(heroesByRR.sort((a, b) => b[currentSort] - a[currentSort]))
    }
    else if (sortBy === "l2f") {
      setTierList(heroesByRR.sort((a, b) => a[currentSort] - b[currentSort]))
    }
    

  }, [rates, matchups, currentRank, currentRole, currentSort, sortBy]);


  return (
    <div className="max-w-6xl mx-auto px-4 space-y-4">
      <div className="text-3xl text-white uppercase text-center py-2">Dota 2 Tier List</div>
      <div className="flex justify-evenly text-white">
        <div class="flex">
          <button 
            className='text-black text-xl space-x-2'
            onMouseEnter={() => setShowRoleInfo(true)}
            onMouseLeave={() => setShowRoleInfo(false)}
            onClick={handleRoleInfoClick}
          >
            ⓘ
          </button>
          {showRoleInfo && (
            <div className="absolute mt-10 bg-gray-800 text-white p-2 rounded-md text-left">
              Hero Role Info
            </div>
          )}
          <div className="p-2 flex space-x-2 rounded-md">
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
        <div class="flex items-center space-x-3">
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
                    
          <form class="max-w-sm mx-auto w-36">
            <select 
              class="bg-gray-800 text-white text-lg rounded-lg block w-full p-2.5"
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

      <div className="overflow-x-auto rounded-md bg-gray-700">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-800 text-white text-xl text-center">
              <th className="px-6 py-2">
                <button onClick={() => handleSortClick("tier_num")}>TIER⇅</button>
              </th>
              <th className=" py-2">
                <button onClick={() => handleSortClick("hero_id")}>HERO⇅</button>
              </th>
              <th className="px-1 py-2">
                ROLE
              </th>
              <th className="px-8 py-2">
                <button onClick={() => handleSortClick("winrate")}>WR⇅</button>
              </th>
              <th className="px-10 py-2">
                <button onClick={() => handleSortClick("pickrate")}>PR⇅</button>
              </th>
              <th className="px-6 py-2">
                <button onClick={() => handleSortClick("matches")}>MATCHES⇅</button>
              </th>
              <th className="px-10 py-2">
                <button onClick={() => handleSortClick("tier_num")}>COUNTERS⇅</button>
              </th>
            </tr>
          </thead>
          <tbody className="text-white text-center">
            {tierList.map((tierItem, index) => {
              return (
                <TierCard
                    tier_str={tierItem.tier_str}
                    hero={heroes.find(hero => hero.hero_id === tierItem.hero_id)}
                    role={tierItem.role}
                    WR={tierItem.winrate}
                    PR={tierItem.pickrate}
                    matches={tierItem.matches}
                    counters={counters.find(obj => obj.hero_id === tierItem.hero_id)}
                    index={index}
                  />
            )})}
          </tbody>
        </table>
      </div>
      
    </div>
    
  );
}

export default TierList;
