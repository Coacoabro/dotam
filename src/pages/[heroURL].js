//individual hero pages. Will have multiple components or pages for this

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useQuery, gql } from "@apollo/client";
import { AM_STATS } from "../graphQL/Queries";

import { fetchHeroWinRatesByRank } from '../heroData';
import GetMatches from '../heroDataQL';

import StaticHeroInfo from '@/components/StaticHeroInfo'
import VariableHeroInfo from '@/components/VariableHeroInfo';
import RateCard from '@/components/RateCard';


import heroNames from '../../dotaconstants/build/hero_names.json';

function HeroPage() {
  
  const router = useRouter();
  const { heroURL } = router.query;
  const heroName = 'npc_dota_hero_' + heroURL
  const heroData = heroNames[heroName]

  const Role = [
    {role: "All", icon: "icons8-product-90.png"},
    {role: "Safe-Lane", icon: "Safe-Lane.png"},
    {role: "Mid-Lane", icon: "Mid-Lane.png"},
    {role: "Off-Lane", icon: "Off-Lane.png"},
    {role: "Soft-Support", icon: "Soft-Support.png"},
    {role: "Hard-Support", icon: "Hard-Support.png"},
  ]

  const Rank = [
    {rank: "All", icon: "icons8-competitive-64.png"},
    {rank: "Herald", icon: "dota_ranks/Herald.png"},
    {rank: "Guardian", icon: "dota_ranks/Guardian.png"},
    {rank: "Crusader", icon: "dota_ranks/Crusader.png"},
    {rank: "Archon", icon: "dota_ranks/Archon.png"},
    {rank: "Legend", icon: "dota_ranks/Legend.png"},
    {rank: "Ancient", icon: "dota_ranks/Ancient.png"},
    {rank: "Divine", icon: "dota_ranks/Divine.png"},
    {rank: "Immortal", icon: "dota_ranks/Immortal.png"},
  ]

  const [currentRole, setCurrentRole] = useState("All");

  const handleRoleClick = (role) => {
    setCurrentRole(role);
  };

  const [currentRank, setCurrentRank] = useState("All");

  const handleRankClick = (rank) => {
    setCurrentRank(rank);
  };

  const [heroWinRate, setHeroWinRate] = useState(null);
  const [heroPickRate, setHeroPickRate] = useState(null);
  const [heroMatches, setHeroMatches] = useState(null);


  setHeroMatches(GetMatches());
  

  useEffect(() => {
    if (heroData) {
      const heroID = heroData.id;
      const fetchWinData = async () => {
        try {
          const { winRate } = await fetchHeroWinRatesByRank({ heroID, currentRank });
          setHeroWinRate(winRate);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchWinData();
    }
  }, [heroData, currentRank]);

  if (!heroData) {
    return;
  }

  else {

    const img = 'https://cdn.cloudflare.steamstatic.com/' + heroData.img

    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex p-3">
          <img src={img} alt={heroName} />
          <StaticHeroInfo heroData={heroData}/>
        </div>
        <div className="flex justify-between px-10">
          <div className="p-2 flex space-x-2 rounded-md">
            {Role.map((role, index) => (
              <button 
                key={index} 
                className={`w-10 h-10 rounded-md border ${role.role === currentRole ? 'bg-blue-300' : ''} `}
                onClick={() => handleRoleClick(role.role)}
                title={role.role}
              >
                <img src={role.icon} alt={role.role} />
              </button>
            ))}
          </div>
          <div className="p-2 flex space-x-2 rounded-md">
            {Rank.map((rank, index) => (
              <button 
                key={index} 
                className={`w-10 h-10 rounded-md border ${rank.rank === currentRank ? 'bg-blue-300' : ''} `} 
                onClick={() => handleRankClick(rank.rank)}
                title={rank.rank}
              >
                <img src={rank.icon} alt={rank.rank}/>
              </button>
            ))}
          </div>
        </div>

        <div className="flex px-20 py-5 justify-between">
          <div className="w-24 h-24 rounded-md border-4">
            <RateCard type="Win Rate" rate={heroWinRate} />
          </div>
          <div className="w-24 h-24 rounded-md border-4">
            <RateCard type="Pick Rate" rate={heroPickRate} />
          </div>
          <div className="w-36 h-24 rounded-md border-4">
            <RateCard type="Matches" rate={heroMatches} />
          </div>
          
        </div>

        <div className="p-1">
          <VariableHeroInfo hero={heroName}/>
        </div>
      </div>
    );
  }

  
}

export default HeroPage;
