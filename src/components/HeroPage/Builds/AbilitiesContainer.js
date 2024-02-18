import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

import basicAbilities from '../StaticHeroInfo'


const AbilitiesContainer = ({heroID, rank, role}) => {

  console.log(basicAbilities)
  

  const abilityBuild = [
    ['Q', null, null, null, null],
    [null, 'W', null, null, null],
    [null, null, 'E', null, null],
    [null, null, null, 'R', null],
    [null, null, null, null, 'Talent'],
    ['Q', null, null, null, null],
    [null, 'W', null, null, null],
    [null, null, 'E', null, null],
    [null, null, null, 'R', null],
    [null, null, null, null, 'Talent'],
  ];
  

  return (
    <div className="grid grid-cols-24">
      
      {abilityBuild.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`}>
          {row.map((ability, colIndex) => (
            <div key={`ability-${rowIndex}-${colIndex+1}`} className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              {ability || ' '}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AbilitiesContainer;
