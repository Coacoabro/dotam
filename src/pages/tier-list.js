import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import TierCard from '../components/TierList/TierCard'

function TierList() {

  const Role = [
    {role: "Safe-Lane", icon: "Safe-Lane.png"},
    {role: "Mid-Lane", icon: "Mid-Lane.png"},
    {role: "Off-Lane", icon: "Off-Lane.png"},
    {role: "Soft-Support", icon: "Soft-Support.png"},
    {role: "Hard-Support", icon: "Hard-Support.png"},
  ]

  const Rank = [
    {rank: "Herald", icon: "dota_ranks/Herald.png"},
    {rank: "Guardian", icon: "dota_ranks/Guardian.png"},
    {rank: "Crusader", icon: "dota_ranks/Crusader.png"},
    {rank: "Archon", icon: "dota_ranks/Archon.png"},
    {rank: "Legend", icon: "dota_ranks/Legend.png"},
    {rank: "Ancient", icon: "dota_ranks/Ancient.png"},
    {rank: "Divine", icon: "dota_ranks/Divine.png"},
    {rank: "Immortal", icon: "dota_ranks/Immortal.png"},
  ]

  const [currentRole, setCurrentRole] = useState(null);

  const handleRoleClick = (role) => {
    setCurrentRole(role);
  };

  const [currentRank, setCurrentRank] = useState(null);

  const handleRankClick = (rank) => {
    setCurrentRank(rank);
  };


  

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-4">
      <div className="text-xl text-center py-2">Dota 2 Tier List</div>
      <div className="text-md text-center py-2">This tier list is based on current statistical data from almost all games played within the current patch</div>
      <div className="flex space-x-20 px-10">
        <div className="p-2 flex space-x-2 rounded-md bg-gray-700">
          {Role.map((role, index) => (
            <button key={index} className="w-10 h-10 rounded-md border" onClick={() => handleRoleClick(role)}>
              <img src={role.icon} alt={role.role} />
            </button>
          ))}
        </div>
        <div className="p-2 flex space-x-2 rounded-md bg-gray-700">
          {Rank.map((rank, index) => (
            <button key={index} className="w-10 h-10 rounded-md border" onClick={() => handleRankClick(rank)}>
              <img src={rank.icon} alt={rank.rank}/>
            </button>
          ))}
        </div>
        <div className="rounded-md p-2">
          <button className="w-10 h-10 rounded-md border text-white text-xs p-1">7.34e</button>
        </div>
      </div>
      <div className="p-2 space-y-3 rounded-md bg-gray-700">
          <h1 className="flex">
            <div className="px-8">Tier</div>
            <div className="px-36">Hero</div>
            <div className="px-8">Win Rate</div>
            <div className="px-8">Pick Rate</div>
            <div className="px-8">Matches</div>
            <div className="px-24">Hero Counter</div>
          </h1>
          <TierCard />
      </div>
      
    </div>
    
  );
}

export default TierList;
