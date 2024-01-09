import React, { useState } from 'react';
import BuildsInfo from './Builds/BuildsInfo';
import ItemsInfo from './Items/ItemsInfo';
import AbilitiesInfo from './AbilitiesInfo';
import MatchupsInfo from './Matchups/MatchupsInfo'
import TopTabBar from './TopTabBar';

function VariableHeroInfo({hero}) {
  const [activeTab, setActiveTab] = useState(0);
  let Content;

  switch (activeTab) {
    case 0:
      Content = <BuildsInfo hero={hero}/>;
      break;
    case 1:
      Content = <ItemsInfo hero={hero}/>;
      break;
    case 2:
      Content = <AbilitiesInfo hero={hero}/>;
      break;
    case 3:
      Content = <MatchupsInfo hero={hero}/>;
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
