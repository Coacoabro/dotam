import React, { useState } from 'react';
import HeroCard from './HeroCard'

function HeroTable({heroes, search, attr, img}) {

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl py-4 px-2 sm:px-4">

      <div 
        className="flex justify-left items-center h-full sm:text-xl text-white gap-2 inline-flex"
      >
        <img className="w-6 sm:w-8" src={img} />
        <div className="">
          {attr}
        </div>
      </div>

      <div className="grid grid-cols-5 place-items-center sm:grid-cols-9">
        {heroes.map(hero => (
          <div>
            <HeroCard key={hero.id} hero={hero} search={search} />
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default HeroTable;
