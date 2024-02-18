import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';


const AbilitiesContainer = ({heroID, rank, role}) => {

  const abilityBuild = [
    ['1', '2', '3', '4', '5'],
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
    <div className="grid grid-cols-12">
      {abilityBuild.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`}>
          {row.map((ability, colIndex) => (
            <div key={`ability-${rowIndex}-${colIndex}`} className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              {ability || ' '}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AbilitiesContainer;
