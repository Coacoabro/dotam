import React, { useState } from 'react';
import BuildsInfo from './BuildsInfo';
import ItemsInfo from './ItemsInfo';
import AbilitiesInfo from './AbilitiesInfo';
import MatchupsInfo from './MatchupsInfo'
import TopTabBar from './TopTabBar';

function VariableHeroInfo() {
  const [activeTab, setActiveTab] = useState(0);
  let Content;

  switch (activeTab) {
    case 0:
      Content = <BuildsInfo />;
      break;
    case 1:
      Content = <ItemsInfo />;
      break;
    case 2:
      Content = <AbilitiesInfo />;
      break;
    case 3:
      Content = <MatchupsInfo />;
      break;
    
    default:
      Content = null;
  }

  return (
    <div>
      <div className="p-1">
        <TopTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div>{Content}</div>
      </div>
    </div>
  );
}

export default VariableHeroInfo;
