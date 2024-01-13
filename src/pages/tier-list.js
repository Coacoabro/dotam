import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

import TierCard from '../components/TierList/TierCard'

function standardDeviation(arr) {
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b) / n;
  const deviation = Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
  return deviation
}

function mean(arr) {
  return arr.reduce((a, b) => a + b) / arr.length;
}


function TierList() {

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

  const [tierList, setTierList] = useState([{}]);

  const [infoChange, setInfoChange] = useState(true);   

  useEffect(() => {
      setInfoChange(true);
  }, [currentRank, currentRole]);

  const HERO_STATS = gql`
            query{
                heroStats {
                winMonth(
                    gameModeIds: ALL_PICK_RANKED
                    ${currentRole ? `positionIds: ${currentRole}` : ''}
                    ${currentRank ? `bracketIds: ${currentRank}` : ''}
                ) {
                    month
                    winCount
                    matchCount
                    heroId
                }
                }
            }
        `;

  const { data } = useQuery(HERO_STATS);
  
  useEffect(() => {
    if (data) {

      let highestMonth = 0;
      let totalMatches = 0;
      let arrayWR = [];
      let arrayPR = [];

      if (infoChange) {

        data.heroStats.winMonth.forEach((winMonth) => {
          if (winMonth.month > highestMonth) {
            highestMonth = winMonth.month;
          }
        });

        data.heroStats.winMonth.forEach((winMonth) => {
          if (winMonth.month === highestMonth) {
            totalMatches += winMonth.matchCount;
            arrayWR.push(winMonth.winCount/winMonth.matchCount);
          }
        });

        let finalTotal = totalMatches/10;
        if (currentRole) {
          finalTotal *= 5;
        }

        if (finalTotal !== 0) {
          let tierList = [];

          data.heroStats.winMonth.forEach((winMonth) => {
            if (winMonth.month === highestMonth) {
              arrayPR.push(winMonth.matchCount/finalTotal)
            }
          });

          data.heroStats.winMonth.forEach((winMonth) => {
            if (winMonth.month === highestMonth) {
              const heroId = winMonth.heroId;
              const heroMatches = winMonth.matchCount;
              const heroWR = winMonth.winCount/winMonth.matchCount;
              const heroPR = winMonth.matchCount/finalTotal;

              //Tier List Formula
              //Standard Deviation to find Z-Score
              const sdWR = standardDeviation(arrayWR)
              const sdPR = standardDeviation(arrayPR)
              const zScoreWR = (heroWR - mean(arrayWR)) / sdWR;
              const zScorePR = (heroPR - mean(arrayPR)) / sdPR;

              let score;
              if (zScoreWR < 0) {
                score = zScoreWR - zScorePR;
              } else {
                score = zScoreWR + zScorePR;
              }

              const heroObj = {
                id: heroId,
                M: heroMatches,
                WR: heroWR,
                PR: heroPR,
                score: score
              }
              tierList.push(heroObj);
            }
          });

          tierList.sort((a, b) => b.score - a.score);

          setTierList(tierList);

        }

      }

    }
  }, [data]);

  console.log(currentRank, currentRole)

  

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-4">
      <div className="text-xl text-center py-2">Dota 2 Tier List</div>
      <div className="text-md text-center py-2">This tier list is based on current statistical data from almost all games played within the current patch</div>
      <div className="flex space-x-20 px-10">
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
          <div>
          { 
            currentRole === "" ?
            tierList.map((tierItem, index) => (
              <TierCard
                score={tierItem.score}
                heroId={tierItem.id}
                WR={tierItem.WR}
                PR={tierItem.PR}
                matches={tierItem.M}
              />
            ))
            :
            tierList
                .filter(tierItem => {return tierItem.PR >= 0.01;})
                .map((tierItem, index) => (
                  <TierCard
                    score={tierItem.score}
                    heroId={tierItem.id}
                    WR={tierItem.WR}
                    PR={tierItem.PR}
                    matches={tierItem.M}
                  />
                ))
          }
          </div>
          
          
          
          
      </div>
      
    </div>
    
  );
}

export default TierList;
