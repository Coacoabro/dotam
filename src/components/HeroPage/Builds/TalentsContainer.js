import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

import abilityDesc from '../../../../dotaconstants/build/abilities.json'
import hero_abilities from '../../../../dotaconstants/build/hero_abilities.json'

import Talent from './Talent'

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
      <div className="flex justify-between">
        <h1>LEVEL</h1>
        <h2>TALENT</h2>
        <h3>PICK RATE</h3>
      </div>
      <Talent level="25" talent={talentArray[3]} PR={prArray[3]} />    
      <Talent level="20" talent={talentArray[2]} PR={prArray[2]} />  
      <Talent level="15" talent={talentArray[1]} PR={prArray[1]} />  
      <Talent level="10" talent={talentArray[0]} PR={prArray[0]} />  
    </div>
  
  );
};

export default TalentsContainer;
