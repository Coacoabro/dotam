import { useEffect, useState } from 'react'
import AbilityPath from './AbilityPath'

export default function Abilities({hero, abilities}) {

    if(abilities){

        const [currAbilities, setCurrAbilities] = useState(() => {
            let build = null
                let max = 0
                abilities.forEach((obj) => {
                    if(obj.Matches > max){
                        max = obj.Matches
                        build = {'Abilities': obj.Abilities, 'Matches': obj.Matches.toLocaleString(), 'WR': ((obj.Wins/obj.Matches)*100).toFixed(1)}
                    }
                })
                return build
        })

        useEffect(() => {
            setCurrAbilities(() => {
                let build = null
                let max = 0
                abilities.forEach((obj) => {
                    if(obj.Matches > max){
                        max = obj.Matches
                        build = {'Abilities': obj.Abilities, 'Matches': obj.Matches.toLocaleString(), 'WR': ((obj.Wins/obj.Matches)*100).toFixed(1)}
                    }
                })
                return build
            })
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
                            <h1 className=" font-bold">{currAbilities.WR}</h1>
                            <h2 className="font-medium">% WR</h2>
                            <h3 className="px-2 text-xs sm:text-base text-cyan-300">({currAbilities.Matches} Matches)</h3>
                        </div>
                    : null }
                </div>
                {currAbilities ? <AbilityPath hero={hero} abilities={currAbilities.Abilities} /> : null }
            </div>
        )
    }
}