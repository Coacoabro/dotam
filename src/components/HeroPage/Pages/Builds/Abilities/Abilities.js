import { useEffect, useState } from 'react'
import AbilityPath from './AbilityPath'

export default function Abilities({hero, abilities}) {

    if(abilities){

        const [currAbilities, setCurrAbilities] = useState(abilities[0])
        const [wr, setWR] = useState(((currAbilities.wins/currAbilities.matches)*100).toFixed(2))

        useEffect(() => {
            setCurrAbilities(abilities[0])
            setWR(((currAbilities.wins/currAbilities.matches)*100).toFixed(2))
        }, [abilities])

        return(
            <div className='space-y-2 sm:space-y-5'>
                <div className='sm:flex justify-between space-y-1'>
                    <div className="sm:flex items-end gap-2.5 space-y-1">
                        <p className="text-lg sm:text-xl font-bold">Ability Path</p>
                        <h1 className="text-gray-300/50">Best ability order for {hero.localized_name}</h1>
                    </div>
                    {currAbilities ? 
                        <div className='flex items-center text-base sm:text-lg'>
                            <h1 className=" font-bold">{wr}</h1>
                            <h2 className="font-medium">% WR</h2>
                            <h3 className="px-2 text-xs sm:text-base text-cyan-300">({currAbilities.matches} Matches)</h3>
                        </div>
                    : null }
                </div>
                {currAbilities ? <AbilityPath hero={hero} abilities={currAbilities.abilities} /> : null }
            </div>
        )
    }
}