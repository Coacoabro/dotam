import React, { useState } from 'react';
import HeroCard from './HeroCard'

function HeroTable({heroes, search, attr, img}) {

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 w-80 sm:w-full">

      <div 
        className="flex justify-left items-center h-full sm:text-xl text-white gap-2 inline-flex"
      >
        <img className="w-6 sm:w-8" src={img} />
        <div className="">
          {attr}
        </div>
      </div>

      <div className="flex flex-wrap sm:gap-0 sm:grid sm:grid-cols-8 sm:place-items-center">
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
