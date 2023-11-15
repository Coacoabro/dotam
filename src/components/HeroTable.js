import React, { useState } from 'react';
import HeroCard from './HeroCard'

function HeroTable({heroes, attr}) {
  return (
    <div className="hero-table-container">
      {attr}
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
