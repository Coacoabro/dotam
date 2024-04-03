import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

import heroAbilities from '../../../../dotaconstants/build/hero_abilities.json'
import abilityDesc from '../../../../dotaconstants/build/abilities.json'
import abilityIds from '../../../../dotaconstants/build/ability_ids.json'
import aghsDesc from '../../../../dotaconstants/build/aghs_desc.json'
import heroNames from '../../../../dotaconstants/build/heroes.json'
import TalentsContainer from './TalentsContainer';


const AbilitiesContainer = ({heroID, abilities, onData}) => {

  const hero = heroNames[heroID].name
  const Abilities = heroAbilities[hero].abilities
  const scepterList = aghsDesc
    .filter(scepterAbility => scepterAbility.scepter_new_skill === true)
    .map(scepterAbility => scepterAbility.scepter_skill_name)
  const shardList = aghsDesc
    .filter(shardAbility => shardAbility.shard_new_skill === true)
    .map(shardAbility => shardAbility.shard_skill_name)
  const basicAbilities = []

  Abilities.forEach((ability) => {
      const isHidden = abilityDesc[ability].behavior && abilityDesc[ability].behavior.includes("Hidden");
      const abilityName = abilityDesc[ability].dname
      if (
          scepterList.indexOf(abilityName) !== -1 ||
          shardList.indexOf(abilityName) !== -1 ||
          ability == "generic_hidden" ||
          ability.endsWith("_empty1") ||
          ability.endsWith("_empty2") ||
          isHidden == true
          ) {
          
      } else {
          basicAbilities.push(ability)
      }
  })

  const abilitiesConverted = abilities.map(id => abilityIds[id] || 'Unknown');

  const leveledAbilities = basicAbilities.filter(value => abilitiesConverted.includes(value));

  console.log(leveledAbilities)

  const talentsArray = []

  
  const abilityBuild = []
  
  abilitiesConverted.forEach(name => {
    if (abilityBuild.length < 16){
      if (name === leveledAbilities[0]){
        abilityBuild.push(['Q', null, null, null, null])
      }
      else if (name === leveledAbilities[1]){
        abilityBuild.push([null, 'W', null, null, null])
      }
      else if (name === leveledAbilities[2]){
        abilityBuild.push([null, null, 'E', null, null])
      }
      else if (name === leveledAbilities[3]){
        abilityBuild.push([null, null, null, 'R', null])
      }
      else {
        abilityBuild.push([null, null, null, null, 'T'])
        talentsArray.push(name)
      }
    }
  })    

  const [dataSent, setDataSent] = useState(false)
  
  if (!dataSent) {
    onData(talentsArray)
    setDataSent(true)
  }
  

    
  

  return (
    <div className="text-center">
      <h1 className="text-xl text-white underline">ABILITY ORDER</h1>
      <div className="flex">

        <div className="grid grid-cols-17 gap-2 text-center p-2">
          <div className="grid grid-rosw-5 gap-2">
            {leveledAbilities.map((ability) => (
              <div className="w-10 h-10 rounded-sm flex items-center justify-center">
                <img src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`} />
              </div>
            ))}
            <div className="w-10 h-10 rounded-sm flex items-center justify-center">
              <img src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg'/>
            </div>
          </div>
          {abilityBuild.map((row) => (
            <div className="grid grid-rows-5 gap-2">
              {row.map((ability) => (
                <div className={`w-10 h-10 rounded-sm flex items-center bold justify-center ${ability ? 'bg-gray-200' : 'bg-gray-400'}`}>
                  {ability || ' '}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>      
    </div>
    
  );
};

export default AbilitiesContainer;
