import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../../../pages/_app';

import basicAbilities from '../StaticHeroInfo'


const AbilitiesContainer = ({heroID, rank, role}) => {

  
  const basicAbilities = [
    {name: 'Mana Break', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/antimage_mana_break.png'},
    {name: 'Blink', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/antimage_blink.png'},
    {name: 'Counter Spell', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/antimage_counterspell.png'},
    {name: 'Mana Void', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/antimage_mana_void.png'},
    {name: 'Talents', img: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg'},
  ]

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
      <h1>Ability Order</h1>
      <h2>Taken from Immortal+ players and averaged them out</h2>
      <div className="flex">

        <div className="grid grid-cols-17 gap-2 text-center p-2">
          <div className="grid grid-rosw-5 gap-2">
            {basicAbilities.map((ability) => (
              <div className="w-10 h-10 rounded-sm flex items-center justify-center">
                <img src={ability.img} />
              </div>
            ))}
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
