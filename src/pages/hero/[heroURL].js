import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from "@apollo/client";

import StaticHeroInfo from '@/components/HeroPage/StaticHeroInfo'
import VariableHeroInfo from '@/components/HeroPage/VariableHeroInfo';
import RatesContainer from '@/components/HeroPage/RatesContainer';


import heroNames from '../../../dotaconstants/build/heroes.json';

function HeroPage() {

  const router = useRouter();
  const heroID = router.query.heroURL;
  const heroData = heroNames[heroID]

  const Role = [
    {role: "", name: "All", icon: "../icons8-product-90.png"},
    {role: "POSITION_1", name: "Safe-Lane", icon: "../Safe-Lane.png"},
    {role: "POSITION_2", name: "Mid-Lane", icon: "../Mid-Lane.png"},
    {role: "POSITION_3", name: "Off-Lane", icon: "../Off-Lane.png"},
    {role: "POSITION_4", name: "Soft-Support", icon: "../Soft-Support.png"},
    {role: "POSITION_5", name: "Hard-Support", icon: "../Hard-Support.png"},
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

  if (!heroData) {
    return;
  }

  else {
    
    const heroName = heroData.localized_name

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
                title={role.name}
              >
                <img src={role.icon} alt={role.name} />
              </button>
            ))}
          </div>
          <div className="p-2 flex space-x-2 rounded-md">
            {Rank.map((rank, index) => (
              <button 
                key={index} 
                className={`w-10 h-10 rounded-md border ${rank.rank === currentRank ? 'bg-blue-300' : ''} `} 
                onClick={() => handleRankClick(rank.rank)}
                title={rank.name}
              >
                <img src={rank.icon} alt={rank.name}/>
              </button>
            ))}
          </div>
        </div>

        <RatesContainer heroId = {heroData.id} rank={currentRank} role={currentRole} />
        
        
        <div className="p-1">
          <VariableHeroInfo hero={heroName}/>
        </div>
      </div>
    );
  }

  
}

export default HeroPage;