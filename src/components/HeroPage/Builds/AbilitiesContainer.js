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

  const ultimateAbility = basicAbilities[basicAbilities.length - 1]

  const heroAbilityIds = [abilities['min1'][0].ability, abilities['min2'][0].ability, abilities['min3'][0].ability]

  const abilitiesConverted = basicAbilities.filter(value => heroAbilityIds.map(id => abilityIds[id] || 'Unknown').includes(value));

  abilitiesConverted.push(ultimateAbility)

  const minAbilities = [abilities['min1'], abilities['min2'], abilities['min3']]
  const maxAbilities = [abilities['max1'], abilities['max2'], abilities['max3']]

  let maxMatchCount = 0
  let min1stMost = {}
  let min2ndMost = {}
  let min3rdMost = {}
  let max1stMost = {}
  let max2ndMost = {}
  let max3rdMost = {}

  minAbilities.forEach(abilitiesArray => {
    abilitiesArray.forEach(obj => {
      if (obj.matchCount > maxMatchCount) {
        maxMatchCount = obj.matchCount;
        min1stMost = {'Level': obj.level, 'Ability': abilityIds[obj.ability]};
      }
    })
  })
  maxMatchCount = 0
  minAbilities.forEach(abilitiesArray => {
    abilitiesArray.forEach(obj => {
      if (obj.matchCount > maxMatchCount && abilityIds[obj.ability] !== min1stMost.Ability) {
        maxMatchCount = obj.matchCount;
        min2ndMost = {'Level': obj.level, 'Ability': abilityIds[obj.ability]};
      }
    })
  })
  maxMatchCount = 0
  minAbilities.forEach(abilitiesArray => {
    abilitiesArray.forEach(obj => {
      if (obj.matchCount > maxMatchCount && abilityIds[obj.ability] !== min1stMost.Ability && abilityIds[obj.ability] !== min2ndMost.Ability  && obj.level !== min2ndMost.Level) {
        maxMatchCount = obj.matchCount;
        min3rdMost = {'Level': obj.level, 'Ability': abilityIds[obj.ability]};
      }
    })
  })

  maxAbilities.forEach(abilitiesArray => {
    abilitiesArray.forEach(obj => {
      if (obj.matchCount > maxMatchCount) {
        maxMatchCount = obj.matchCount;
        max1stMost = {'Level': obj.level, 'Ability': abilityIds[obj.ability]};
      }
    })
  })
  maxMatchCount = 0
  maxAbilities.forEach(abilitiesArray => {
    abilitiesArray.forEach(obj => {
      if (obj.matchCount > maxMatchCount && abilityIds[obj.ability] !== max1stMost.Ability) {
        maxMatchCount = obj.matchCount;
        max2ndMost = {'Level': obj.level, 'Ability': abilityIds[obj.ability]};
      }
    })
  })
  maxMatchCount = 0
  maxAbilities.forEach(abilitiesArray => {
    abilitiesArray.forEach(obj => {
      if (obj.matchCount > maxMatchCount && abilityIds[obj.ability] !== max1stMost.Ability && abilityIds[obj.ability] !== max2ndMost.Ability  && obj.level !== max2ndMost.Level) {
        maxMatchCount = obj.matchCount;
        max3rdMost = {'Level': obj.level, 'Ability': abilityIds[obj.ability]};
      }
    })
  })


  const firstLevels = [min1stMost, min2ndMost, min3rdMost]
  firstLevels.sort((a, b) => a.Level -b.Level)
  const finalLevels = [max1stMost, max2ndMost, max3rdMost]
  finalLevels.sort((a, b) => a.Level -b.Level)

  const abilityBuild = Array(16)
  //Level 1
  abilityBuild[0] = firstLevels[0].Ability
  //Level 2
  abilityBuild[1] = firstLevels[1].Ability
  //Level 3
  if(firstLevels[2].Level !== 3) {
    if(finalLevels[0].Level === 7) {
      abilityBuild[2] = finalLevels[0].Ability
    }
    else if(finalLevels[0].Level !== 7){
      abilityBuild[2] = finalLevels[1].Ability
    }
  } else {abilityBuild[2] = firstLevels[2].Ability}
  //Level 4
  if(abilityBuild[2] === firstLevels[2].Ability) {
    if(finalLevels[0].Level === 7) {
      abilityBuild[3] = finalLevels[0].Ability
    }
    else if(finalLevels[0].Level !== 7){
      abilityBuild[3] = finalLevels[1].Ability
    }
  } else {abilityBuild[3] = firstLevels[2].Ability}
  //Level 5
  abilityBuild[4] = finalLevels[0].Ability
  //Level 6
  abilityBuild[5] = ultimateAbility
  //Level 7
  abilityBuild[6] = finalLevels[0].Ability
  //Level 8
  if(finalLevels[0].Level !== 7) {
    abilityBuild[7] = finalLevels[0].Ability
  } else {abilityBuild[7] = finalLevels[1].Ability}
  //Level 9
  abilityBuild[8] = finalLevels[1].Ability
  //Level 10 (Talent)
  abilityBuild[9] = 0
  //Level 11
  abilityBuild[10] = finalLevels[1].Ability
  //Level 12
  abilityBuild[11] = ultimateAbility
  //Level 13

  //Level 14
  abilityBuild[13] = finalLevels[2].Ability
  //Level 15
  abilityBuild[14] = 0
  //Level 16
  abilityBuild[15] = finalLevels[2].Ability
  





  const finishedAbilityBuild = []



  


  const talentsArray = []
  
  abilityBuild.forEach(name => {
    if (finishedAbilityBuild.length < 16){
      if (name === abilitiesConverted[0]){
        finishedAbilityBuild.push(['Q', null, null, null, null])
      }
      else if (name === abilitiesConverted[1]){
        finishedAbilityBuild.push([null, 'W', null, null, null])
      }
      else if (name === abilitiesConverted[2]){
        finishedAbilityBuild.push([null, null, 'E', null, null])
      }
      else if (name === abilitiesConverted[3]){
        finishedAbilityBuild.push([null, null, null, 'R', null])
      }
      else {
        finishedAbilityBuild.push([null, null, null, null, 'T'])
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
            {abilitiesConverted.map((ability) => (
              <div className="w-10 h-10 rounded-sm flex items-center justify-center">
                <img src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`} />
              </div>
            ))}
            <div className="w-10 h-10 rounded-sm flex items-center justify-center">
              <img src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg'/>
            </div>
          </div>
          {finishedAbilityBuild.map((row) => (
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
