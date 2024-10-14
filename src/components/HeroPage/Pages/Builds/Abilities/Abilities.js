import { useEffect, useState } from 'react'
import AbilityPath from './AbilityPath'

export default function Abilities({hero, abilities}) {

    if(abilities){

        const wr = ((abilities.wins/abilities.matches)*100).toFixed(2)

        return(
            <div className='space-y-2 sm:space-y-5'>
                <div className='sm:flex justify-between space-y-1'>
                    <div className="sm:flex items-end gap-2.5 space-y-1">
                        <p className="text-lg sm:text-xl font-bold">Ability Path</p>
                        <h1 className="text-gray-300/50">Best ability order for {hero.localized_name}</h1>
                    </div>
                    {abilities[0] ? 
                        <div className='flex items-center text-base sm:text-lg'>
                            <h1 className=" font-bold">{wr}</h1>
                            <h2 className="font-medium">% WR</h2>
                            <h3 className="px-2 text-xs sm:text-base text-cyan-300">({abilities.matches} Matches)</h3>
                        </div>
                    : null }
                </div>
                {abilities ? <AbilityPath hero={hero} abilities={abilities.abilities} /> : null }
            </div>
        )
    }
}