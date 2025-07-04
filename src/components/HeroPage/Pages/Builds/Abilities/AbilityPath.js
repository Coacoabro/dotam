import hero_abilities from '../../../../../../json/hero_abilities'
import heroAbilities from '../../../../../../dotaconstants/build/hero_abilities.json'
import abilityDesc from '../../../../../../dotaconstants/build/abilities.json'
import abilityIds from '../../../../../../dotaconstants/build/ability_ids.json'

import AbilityCard from '../../../AbilityCard'
import { useState } from 'react'
import HoveredTalent from './HoveredTalent'

export default function AbilityPath({hero, abilities, talents}) {

    const heroName = hero.name
    const Abilities = heroAbilities[heroName].abilities

    const initBasicAbilities = []
    const basicAbilities = []
    const basicAbilityLength = hero_abilities[hero.hero_id].length - 1
    const heroInitAbilities = hero_abilities[hero.hero_id].slice(0, basicAbilityLength);
    const heroInitiUltimate = abilityIds[hero_abilities[hero.hero_id].at(-1)];

    const [talentHovered, setTalentHovered] = useState(null)
    const [talentRow, setTalentRow] = useState(null)

    const handleTalentHovered = (talent, index) => {
        setTalentHovered(talent)
        setTalentRow(index)
    }
    
    heroInitAbilities.forEach((ability) => {
        if(abilities.includes(ability)){
            initBasicAbilities.push(abilityIds[ability])
        }
    })

    Abilities.forEach((ability) => {
        if (initBasicAbilities.includes(ability)) {
            basicAbilities.push(ability)
        }
    })

    if(basicAbilities.length < 3) {
        heroInitAbilities.forEach((ability) => {
            if (!basicAbilities.includes(abilityIds[ability]) && abilities.includes(ability)) {
                basicAbilities.push(abilityIds[ability])
            }
        })
    }

    basicAbilities.push(heroInitiUltimate)

    const finishedAbilities = []
    const finishedTalents = []

    abilities.forEach((ability, index) => {
        if (finishedAbilities.length < 17){
            // Io tether break
            if(ability == 5489) {
                ability = 5485
            }
            // Faceless Void Chrono/Time Warp
            if(ability == 1281) {
                ability = 5185
            }
            if(ability > 0) {
                const name = abilityIds[ability]
                
                if (name === basicAbilities[0]){
                    finishedAbilities.push([index+1, null, null, null, null])
                    finishedTalents.push(null)
                }
                else if (name === basicAbilities[1]){
                    finishedAbilities.push([null, index+1, null, null, null])
                    finishedTalents.push(null)
                }
                else if (name === basicAbilities[2]){
                    finishedAbilities.push([null, null, index+1, null, null])
                    finishedTalents.push(null)
                }
                else if (name === basicAbilities[3]){
                    finishedAbilities.push([null, null, null, index+1, null])
                    finishedTalents.push(null)
                }
                else {
                    finishedAbilities.push([null, null, null, null, index+1])
                    finishedTalents.push(ability)
                }
            }
        }
    })    
    
    
    return (
        <div className='overflow-x-scroll sm:overflow-visible'>
            <div className="min-w-[540px] grid grid-cols-17 sm:gap-2.5 text-center">
                <div className="grid grid-rows-5 gap-1 sm:gap-2.5">
                {basicAbilities ? basicAbilities.map((ability, index) => (
                    <div className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center z-[${(3-index)*5}]`}>
                        <AbilityCard ability={ability} hero={hero.name} path={true} />
                        {/* <img src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`} className='rounded-lg' title={abilityDesc[ability].dname} /> */}
                    </div>
                )) : <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg flex items-center justify-center"> </div>}
                    <div className="w-6 h-6 md:w-10 md:h-10 rounded-sm flex items-center justify-right">
                        <img src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg'/>
                    </div>
                </div>
                {finishedAbilities.map((row, index) => (
                    <div className="grid grid-rows-5 sm:gap-2.5">
                        {row.map((ability, abilityIndex) => (
                            <>
                                <div 
                                    className={`
                                        w-7 h-7 md:w-10 md:h-10 rounded-lg flex md:text-md text-sm items-center bold justify-center 
                                        ${ability ? 'bg-slate-800 border border-slate-700/50' : 'bg-slate-950'}
                                        ${abilityIndex == 4 && ability ? "hover:bg-slate-700" : ""}
                                    `}
                                    {...(abilityIndex == 4 && ability ? { 
                                        onMouseEnter: () => handleTalentHovered(finishedTalents[index], index),
                                        onMouseLeave: () => handleTalentHovered(null, null)
                                    } : {})}
                                >
                                    {ability || ''}
                                </div>
                                {talentHovered && abilityIndex == 4 && finishedTalents[index] && talentRow == index && (
                                    <HoveredTalent hero_talents={talents} talent={finishedTalents[index]} />
                                )}
                            </>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    
    );
}