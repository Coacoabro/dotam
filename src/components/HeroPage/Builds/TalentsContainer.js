import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

import abilityDesc from '../../../../dotaconstants/build/abilities.json'
import hero_abilities from '../../../../dotaconstants/build/hero_abilities.json'

const TalentsContainer = ({hero, talents}) => { 

  const talentArray = Array(4)

  const talentOrder = hero_abilities[hero].talents

  console.log(talents)

  for (let i=1; i<5; i++) {
    const levelTalents = talentOrder.filter(obj => obj.level === i)
    console.log(levelTalents)
    let highestMatches = 0
    levelTalents.forEach(obj => {
      let talent = talents.filter(object => object.Ability === obj.name)
      talent = talent[0]
      if(talent && talent.Matches > highestMatches) {
        highestMatches = talent.Matches
        talentArray[i-1] = abilityDesc[talent.Ability].dname
      }
    })
  }

  console.log(talentArray)

  return(
    <div className="text-center text-white">
      <h1 className="text-xl underline">TALENTS</h1>
      <h2>25: {talentArray[3]}</h2>
      <h3>20: {talentArray[2]}</h3>
      <h4>15: {talentArray[1]}</h4>
      <h5>10: {talentArray[0]}</h5>
    </div>
  
  );
};

export default TalentsContainer;
