import React, { useState } from 'react';
import HeroCard from './HeroCard'

function HeroTable({heroes, attr, img}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">

      <div 
        className="flex justify-left items-center h-full text-xl text-white gap-2 inline-flex"
      >
        <img className="w-8" src={img} />
        <div className="sm:block hidden">
          {attr}
        </div>
      </div>

      <div className="grid grid-cols-3 place-items-center lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4">
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
