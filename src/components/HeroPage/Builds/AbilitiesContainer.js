import React, { useState, useEffect } from 'react';

import heroAbilities from '../../../../dotaconstants/build/hero_abilities.json'
import abilityDesc from '../../../../dotaconstants/build/abilities.json'
import abilityIds from '../../../../dotaconstants/build/ability_ids.json'
import aghsDesc from '../../../../dotaconstants/build/aghs_desc.json'

import AbilityCard from '../AbilityCard'


const AbilitiesContainer = ({hero, abilities}) => {

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
  const ultimateAbility = basicAbilities[basicAbilities.length - 1] 
  const abilitiesConverted = basicAbilities.filter(value => abilities.map(id => abilityIds[id] || 'Unknown').includes(value))
  abilitiesConverted.push(ultimateAbility)
  const finishedAbilities = []

  abilities.forEach((ability) => {
    if (finishedAbilities.length < 17){
      if(ability > 0) {
        const name = abilityIds[ability]
        if (name === abilitiesConverted[0]){
          finishedAbilities.push(['Q', null, null, null, null])
        }
        else if (name === abilitiesConverted[1]){
          finishedAbilities.push([null, 'W', null, null, null])
        }
        else if (name === abilitiesConverted[2]){
          finishedAbilities.push([null, null, 'E', null, null])
        }
      }
      
      else if (ability != 0){
        finishedAbilities.push([null, null, null, 'R', null])
      }
      else {
        finishedAbilities.push([null, null, null, null, 'T'])
      }
    }
  })

  
  const levels = Array.from({length: 16}, (_, index) => index +1)
  

  return (
    <div className="text-center">
      <h1 className="text-xl text-white underline">ABILITY ORDER</h1>
      <div className="flex">

        <div className="grid grid-cols-17 gap-2 text-center p-2">
          <div className="grid grid-rows-5 gap-2">
            {abilitiesConverted ? abilitiesConverted.map((ability) => (
              <div className="w-8 h-8 rounded-sm flex items-center justify-center">
                <img src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`} title={abilityDesc[ability].dname} />
              </div>
            )) : <div className="w-8 h-8 rounded-sm flex items-center justify-center"> </div>}
            <div className="w-8 h-8 rounded-sm flex items-center justify-center">
              <img src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg'/>
            </div>
          </div>
          {finishedAbilities.map((row) => (
            <div className="grid grid-rows-5 gap-2">
              {row.map((ability) => (
                <div className={`w-8 h-8 rounded-sm flex items-center bold justify-center ${ability ? 'bg-gray-200' : 'bg-gray-400'}`}>
                  {ability || ' '}
                </div>
              ))}
            </div>
          ))}
          <div> </div>
          {levels.map(level => (
                <div className="w-8 h-8 text-down text-white">{level}</div>
              ))}
        </div>
      </div>      
    </div>
    
  );
};

export default AbilitiesContainer;
