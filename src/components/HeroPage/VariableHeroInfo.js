import React, { useEffect, useState } from 'react';
import BuildsInfo from './Builds/BuildsInfo';
import ItemsInfo from './Items/ItemsInfo';
import AbilitiesInfo from './AbilitiesInfo';
import MatchupsInfo from './Matchups/MatchupsInfo'
import TopTabBar from './TopTabBar';

function VariableHeroInfo({heroID, rank, role, builds, abilities, items, matchups}) {

  const itemBuilds = builds[0].items

  const [currAbilities, setCurrAbilities] = useState([])
  const [currTalents, setCurrTalents] = useState([])
  const [currItems, setCurrItems] = useState([])
  const [currMatchups, setCurrMatchups] = useState([])

  const rankList = {
      '': '',
      'HERALD': 'HERALD_GUARDIAN',
      'GUARDIAN': 'HERALD_GUARDIAN',
      'CRUSADER': 'CRUSADER_ARCHON',
      'ARCHON': 'CRUSADER_ARCHON',
      'LEGEND': 'LEGEND_ANCIENT',
      'ANCIENT': 'LEGEND_ANCIENT',
      'DIVINE': 'DIVINE_IMMORTAL',
      'IMMORTAL': 'DIVINE_IMMORTAL'
    };
  
  const trueRank = rankList[rank]

  useEffect(() => {
      let filteredAbilities = abilities.find(r => r.role === role && r.hero_id === heroID)
      let filteredItems = items.find(r => r.role === role && r.rank === trueRank && r.hero_id === heroID)
      let filteredMatchups = matchups.find(r => r.rank === trueRank && r.hero_id === heroID)
      setCurrAbilities(filteredAbilities.build)
      setCurrTalents(filteredAbilities.talents)
      setCurrItems(filteredItems)
      setCurrMatchups(filteredMatchups)
  }, [heroID, role, abilities, items, trueRank, matchups])

  const [activeTab, setActiveTab] = useState(0);
  let Content;

  switch (activeTab) {
    case 0:
      Content = <BuildsInfo heroID={heroID} builds={itemBuilds} abilities={currAbilities} talents={currTalents} items={currItems}/>;
      break;
    case 1:
      Content = <ItemsInfo heroID={heroID} items={currItems} />;
      break;
    case 2:
      Content = <AbilitiesInfo heroID={heroID} rank={rank} role={role} />;
      break;
    case 3:
      Content = <MatchupsInfo heroID={heroID} matchups={currMatchups} />;
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
