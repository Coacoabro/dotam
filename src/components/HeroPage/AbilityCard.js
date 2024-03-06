import React, { useState, useEffect } from 'react';

import heroAbilities from '../../../dotaconstants/build/hero_abilities.json'
import Abilities from '../../../dotaconstants/build/abilities.json'

function AbilityCard({ ability }) {
    const abilityInfo = Abilities[ability];
  
    const showTooltip = (event) => {
      const tooltip = event.target.nextElementSibling;
      tooltip.style.visibility = 'visible';
    };
  
    const hideTooltip = (event) => {
      const tooltip = event.target.nextElementSibling;
      tooltip.style.visibility = 'hidden';
    };
  
    return (
      <div className="relative p-1 h-20 w-20 shadow-2xl">
        <img
          src={'https://cdn.cloudflare.steamstatic.com/' + abilityInfo.img}
          alt={abilityInfo.dname}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        />
        <div
            className="absolute bg-black text-white p-2 rounded-md text-xs whitespace-pre-line"
            style={{
            visibility: 'hidden',
            top: '110%', // Adjust the position of the tooltip
            left: '50%', // Position the tooltip centrally
            transform: 'translateX(-50%)',
            width: '300px', // Adjust width as needed
            height: 'auto', // Let the height expand according to content
            }}
        >
            <div className="text-lg">{abilityInfo.dname}</div>
            {abilityInfo.desc}
        </div>
      </div>
    );
  }
  
  export default AbilityCard;