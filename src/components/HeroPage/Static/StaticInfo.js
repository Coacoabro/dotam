import { useState } from 'react'

import Innate from "./Innate"
import TalentTree from "./TalentTree"
import AbilityCard from "../AbilityCard"
import Aghanims from "./Aghanims"

import heroAbilities from '../../../../dotaconstants/build/hero_abilities.json'
import abilityDesc from '../../../../dotaconstants/build/abilities.json'
import aghsDesc from '../../../../dotaconstants/build/aghs_desc.json'
import my_hero_abilities from '../../../../json/hero_abilities.json'
import abilityIds from '../../../../dotaconstants/build/ability_ids.json'

export default function StaticInfo({hero}) {

    const heroName = hero.name
    const Abilities = heroAbilities[heroName].abilities

    const initBasicAbilities = []
    const basicAbilities = []

    const heroInitAbilities = my_hero_abilities[hero.hero_id].slice(0, 3);
    const heroInitiUltimate = abilityIds[my_hero_abilities[hero.hero_id][3]];
    
    heroInitAbilities.forEach((ability) => {
        initBasicAbilities.push(abilityIds[ability])
    })

    const aghsObj = aghsDesc.filter(obj => obj.hero_name === heroName)

    let scepter = ""
    let shard = ""

    Abilities.forEach((ability) => {
        const abilityName = abilityDesc[ability].dname
        if (abilityName === aghsObj[0].scepter_skill_name) {
            scepter = ability
        }
        if (abilityName === aghsObj[0].shard_skill_name) {
            shard = ability
        }
        if (initBasicAbilities.includes(ability)) {
            basicAbilities.push(ability)
        }
    })

    if(basicAbilities.length < 3) {
        heroInitAbilities.forEach((ability) => {
            if (!basicAbilities.includes(abilityIds[ability])) {
                basicAbilities.push(abilityIds[ability])
            }
        })
    }

    basicAbilities.push(heroInitiUltimate)

    return(
        <div className="relative z-10 space-y-4">
            <div className="text-5xl font-bold">{hero.localized_name}</div>
            <div className="flex items-center space-x-2">
                <TalentTree talents={heroAbilities[heroName].talents} />
                <Innate id={hero.hero_id} />
                <div className='py-1 h-14 w-[2px] bg-gray-600' />
                <div className="flex items-center">
                {basicAbilities.map(ability => (
                    <AbilityCard ability={ability} hero={heroName} />
                ))}
                </div>
                <div className='py-1 h-14 w-[2px] bg-gray-600' />
                <Aghanims hero={heroName} scepter={scepter} shard={shard} />
            </div>
        </div>
    )
}