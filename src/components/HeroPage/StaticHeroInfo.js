import React, { useState } from 'react';

import heroAbilities from '../../../dotaconstants/build/hero_abilities.json'
import abilityDesc from '../../../dotaconstants/build/abilities.json'
import aghsDesc from '../../../dotaconstants/build/aghs_desc.json'

import AbilityCard from './AbilityCard'
import TalentCard from './TalentCard'
import AghsCard from './AghsCard'

function StaticHeroInfo({heroData}) {

    const hero = heroData.name
    const Abilities = heroAbilities[hero].abilities
    const scepterList = aghsDesc
        .filter(scepterAbility => scepterAbility.scepter_new_skill === true)
        .map(scepterAbility => scepterAbility.scepter_skill_name)
    const shardList = aghsDesc
        .filter(shardAbility => shardAbility.shard_new_skill === true)
        .map(shardAbility => shardAbility.shard_skill_name)
    const basicAbilities = []

    Abilities.forEach((ability) => {
        const isHidden = abilityDesc[ability].behavior && abilityDesc[ability].behavior.includes("Hidden");
        const abilityName = abilityDesc[ability].dname
        if (
            scepterList.indexOf(abilityName) !== -1 ||
            shardList.indexOf(abilityName) !== -1 ||
            ability == "generic_hidden" ||
            ability.endsWith("_empty1") ||
            ability.endsWith("_empty2") ||
            isHidden == true
            ) {
            
        } else {
            basicAbilities.push(ability)
        }
    })

    return(
        <div>
            <div className="text-xl md:text-4xl text-white p-2">
                {heroData.localized_name}
            </div>
            
            <div className="flex">
                <TalentCard hero={hero} />
                {basicAbilities.map(ability => (
                    <AbilityCard ability={ability} />
                ))}
                <AghsCard hero={hero} />
            </div>
        </div>
        
    )
}

export default StaticHeroInfo;
