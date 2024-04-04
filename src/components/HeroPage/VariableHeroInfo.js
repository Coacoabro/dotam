import React, { useState } from 'react';
import BuildsInfo from './Builds/BuildsInfo';
import ItemsInfo from './Items/ItemsInfo';
import AbilitiesInfo from './AbilitiesInfo';
import MatchupsInfo from './Matchups/MatchupsInfo'
import TopTabBar from './TopTabBar';

function VariableHeroInfo({heroID, rank, role, builds, abilities}) {

  const [activeTab, setActiveTab] = useState(0);
  let Content;

  switch (activeTab) {
    case 0:
      Content = <BuildsInfo heroID={heroID} rank={rank} role={role} builds={builds} abilities={abilities} />;
      break;
    case 1:
      Content = <ItemsInfo heroID={heroID} rank={rank} role={role} />;
      break;
    case 2:
      Content = <AbilitiesInfo heroID={heroID} rank={rank} role={role} />;
      break;
    case 3:
      Content = <MatchupsInfo heroID={heroID} rank={rank} role={role} />;
      break;
    
    default:
      Content = null;
  }

  

  return (
    <div className="p-1">
      <TopTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>{Content}</div>
    </div>
  );
}

export default VariableHeroInfo;
