import React, { useState } from 'react';
import HeroCard from './HeroCard'

function HeroTable({heroes}) {
  return (
    <div className="hero-table-container">
      {heroes.map(hero => (
        <div className="hero-card-space">
          <HeroCard key={hero.id} hero={hero} />
        </div>
      ))}
    </div>
  );
}

export default HeroTable;
