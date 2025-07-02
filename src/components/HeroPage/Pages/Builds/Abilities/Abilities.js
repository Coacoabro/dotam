import { useEffect, useState } from 'react'
import AbilityPath from './AbilityPath'

export default function Abilities({hero, abilities, hero_talents}) {

    if(abilities && hero_talents){

        const wr = ((abilities.Wins/abilities.Matches)*100).toFixed(2)

        return(
            <div className='space-y-2 sm:space-y-5'>
                <div className='sm:flex justify-between space-y-1'>
                    <div className="sm:flex items-end gap-2 px-1">
                        <p className="text-lg sm:text-xl font-bold">Ability Path</p>
                        <h1 className="opacity-50">Best ability order for {hero.localized_name}</h1>
                    </div>
                    <div className='flex items-center text-base opacity-75'>
                        <h1 className=" font-bold">{wr}%</h1>
                        <h2 className="font-medium text-xs sm:text-sm">WR</h2>
                        <h3 className="px-2 text-xs sm:text-sm text-cyan-300">({abilities.Matches.toLocaleString()} Matches)</h3>
                    </div>
                </div>
                {abilities ? <AbilityPath hero={hero} abilities={abilities.Abilities} talents={hero_talents} /> : null }
            </div>
        )
    }
}