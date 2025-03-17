import React, { useState } from 'react';
import HeroCard from './HeroCard'

function HeroTable({heroes, search, attr, img}) {

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl py-3 w-80 sm:w-full">

      <div className="flex justify-left items-center h-full sm:text-xl text-white gap-2 inline-flex px-3">
        <img className="w-6 sm:w-8" src={img} />
        {attr}
      </div>

      <div className="flex flex-wrap sm:gap-0 sm:grid sm:grid-cols-4 sm:place-items-center px-2">
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
