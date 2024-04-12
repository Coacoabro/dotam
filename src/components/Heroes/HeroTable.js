import React, { useState } from 'react';
import HeroCard from './HeroCard'

function HeroTable({heroes, attr, img}) {
  return (
    <div className="p-4 bg-gray-800 rounded-md">

      <div className="flex justify-left items-center h-full text-3xl text-white">

        <img src={img} alt={attr} />
        {attr}

      </div>

      <div className="grid grid-cols-2 justify-between lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3">

        {heroes.map(hero => (
          <div>
            <HeroCard key={hero.id} hero={hero} />
          </div>
        ))}
        
      </div>
      
      
    </div>
  );
}

export default HeroTable;
