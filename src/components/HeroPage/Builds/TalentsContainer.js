import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

import abilityDesc from '../../../../dotaconstants/build/abilities.json'
import hero_abilities from '../../../../dotaconstants/build/hero_abilities.json'

const TalentsContainer = ({hero, talents}) => { 

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
    <div className="text-center text-white space-y-2">
      <h1 className="text-xl underline">TALENTS</h1>
      <div className="flex space-x-1">
        <div className="grid grid-rows-4 gap-4 text-lg items-center">
          <h2 className="border-2 rounded-md p-1">25</h2>
          <h3 className="border-2 rounded-md p-1">20</h3>
          <h4 className="border-2 rounded-md p-1">15</h4>
          <h5 className="border-2 rounded-md p-1">10</h5>
        </div>
        <div className="grid grid-rows-4 text-sm gap-4 text-left">
          <h2>{talentArray[3]}</h2>
          <h3>{talentArray[2]}</h3>
          <h4>{talentArray[1]}</h4>
          <h5>{talentArray[0]}</h5>
        </div>
        <div className="grid grid-rows-4 text-xs gap-4 text-right">
          <h2>{prArray[3]}%</h2>
          <h3>{prArray[2]}%</h3>
          <h4>{prArray[1]}%</h4>
          <h5>{prArray[0]}%</h5>
        </div>
      </div>
      
      
    </div>
  
  );
};

export default TalentsContainer;
