import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

import heroAbilities from '../../../../dotaconstants/build/hero_abilities.json'
import abilityDesc from '../../../../dotaconstants/build/abilities.json'
import aghsDesc from '../../../../dotaconstants/build/aghs_desc.json'
import heroNames from '../../../../dotaconstants/build/heroes.json'


const AbilitiesContainer = ({heroID, rank, role}) => {

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

  const abilityBuild = [
    ['Q', null, null, null, null],
    [null, 'W', null, null, null],
    ['Q', null, null, null, null],
    [null, null, 'E', null, null],
    ['Q', null, null, null, null],
    [null, null, null, 'R', null],
    [null, 'W', null, null, null],
    [null, 'W', null, null, null],
    [null, 'W', null, null, null],
    [null, null, null, null, 'T'],
    ['Q', null, null, null, null],
    [null, null, null, 'R', null],
    [null, null, 'E', null, null],
    [null, null, 'E', null, null],
    [null, null, null, null, 'T'],
    [null, null, 'E', null, null],
  ];
  

  return (
    <div className="text-center">
      <h1>ABILITY ORDER</h1>
      <h2>Taken from Immortal+ players and averaged them out</h2>
      <div className="flex">

        <div className="grid grid-cols-17 gap-2 text-center p-2">
          <div className="grid grid-rosw-5 gap-2">
            {basicAbilities.map((ability) => (
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
