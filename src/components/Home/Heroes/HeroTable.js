import React, { useState } from 'react';
import HeroCard from './HeroCard'

function HeroTable({heroes, search, attr, img}) {

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl py-3 w-80 sm:w-full">

      <div className="flex justify-left items-center h-full sm:text-lg text-white gap-2 inline-flex px-3">
        <img className="w-6" src={img} />
        {attr}
      </div>

      <div className="flex flex-wrap sm:gap-[4px] sm:grid sm:grid-cols-4 sm:place-items-center px-1">
        {heroes.map(hero => (
          <div>
            <HeroCard hero={hero} search={search} />
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default HeroTable;
