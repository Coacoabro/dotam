import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

import abilityDesc from '../../../../dotaconstants/build/abilities.json'

const TalentsContainer = ({talents}) => { 

  const talentArray = []

  talents.forEach((talent) => {
    talentArray.push(abilityDesc[talent].dname)
  })

  return(
    <div className="text-center text-white">
      <h1 className="text-xl underline">TALENTS</h1>
      <h2>25: {talentArray[3] ? talentArray[3] : '?'}</h2>
      <h3>20: {talentArray[2] ? talentArray[2] : '?'}</h3>
      <h4>15: {talentArray[1] ? talentArray[1] : '?'}</h4>
      <h5>10: {talentArray[0] ? talentArray[0] : '?'}</h5>
    </div>
  
  );
};

export default TalentsContainer;
