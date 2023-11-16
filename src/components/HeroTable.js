import React, { useState } from 'react';
import HeroCard from './HeroCard'

function HeroTable({heroes, attr, img}) {
  return (
    <div className="p-4">
      <div className="flex justify-left items-center h-full text-3xl text-white">
        <img src={img} alt={attr} />
        {attr}
      </div>
      <div className="flex flex-wrap">
        {heroes.map(hero => (
          <div className="hero-card-space">
            <HeroCard key={hero.id} hero={hero} />
          </div>
        ))}
      </div>
      
      
    </div>
  );
}

export default HeroTable;
