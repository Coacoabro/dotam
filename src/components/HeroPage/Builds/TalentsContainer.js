import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

import abilityDesc from '../../../../dotaconstants/build/abilities.json'
import hero_abilities from '../../../../dotaconstants/build/hero_abilities.json'

import Talent from './Talent'

const TalentsContainer = ({hero, talents}) => { 

  const talentObject = hero_abilities[hero].talents

  const leftTalents = talentObject
      .filter((talent, index) => index % 2 === 0) // Get every other element
      .map(talent => talent.name) // Extract the 'name' value
      .reverse();
  const leftTalentNames = leftTalents.map(talent => (abilityDesc[talent].dname))

  const rightTalents = talentObject
      .filter((talent, index) => index % 2 === 1) // Get every other element
      .map(talent => talent.name) // Extract the 'name' value
      .reverse();
  const rightTalentNames = rightTalents.map(talent => (abilityDesc[talent].dname))

  const talentArray = Array(4)
  const prArray = Array(4)

  const talentOrder = hero_abilities[hero].talents

  for (let i=1; i<5; i++) {
    const levelTalents = talentOrder.filter(obj => obj.level === i)
    let highestMatches = 0
    let totalMatches = 0
    levelTalents.forEach(obj => {
      let talent = talents.filter(object => object.Ability === obj.name)
      talent = talent[0]
      if(talent) {
        totalMatches += talent.Matches
        if(talent.Matches > highestMatches) {
          highestMatches = talent.Matches
          talentArray[i-1] = abilityDesc[talent.Ability].dname
          prArray[i-1] = talent.Matches
        }
      }
    })
    if(totalMatches > 0) {prArray[i-1] = ((prArray[i-1]/totalMatches)*100).toFixed(2)}
  }

  return(
    <div className="text-center text-white space-y-2 bg-gray-700 p-2 rounded-md">
      <h1 className="text-xl">TALENTS</h1>
      <div className="flex">
        <div className="grid grid-rows-4 text-sm gap-1 p-1 h-60 w-48 text-center">
            {rightTalentNames.map((talent) => (
            <div key={talent} className={`rounded-md p-1 ${talentArray.includes(talent) ? 'bg-gray-800 font-bold' : ''}`}>{talent}</div>
            ))}
        </div>
        <div className="grid grid-rows-4 text-lg gap-1 p-1">
            {[25, 20, 15, 10].map(level => (
                <div key={level} className="text-center p-1">
                    {level}
                </div>
            ))}
        </div>
        <div className="grid grid-rows-4 text-sm gap-1 p-1 h-60 w-48 text-center">
            {leftTalentNames.map((talent) => (
            <div key={talent} className={`rounded-md ${talentArray.includes(talent) ? 'bg-gray-800 font-bold' : ''} p-1`}>{talent}</div>
            ))}
        </div>
      </div>
      
    </div>
  
  );
};

export default TalentsContainer;
