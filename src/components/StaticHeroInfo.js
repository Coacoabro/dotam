import React, { useState } from 'react';
import Link from 'next/link';

import heroAbilities from '../../dotaconstants/build/hero_abilities.json'
import abilityDesc from '../../dotaconstants/build/abilities.json'
import aghsDesc from '../../dotaconstants/build/aghs_desc.json'

import AbilityCard from './AbilityCard'

function StaticBlock({hero}) {
    const Abilities = heroAbilities[hero].abilities
    const scepterList = aghsDesc
        .filter(scepterAbility => scepterAbility.scepter_new_skill === true)
        .map(scepterAbility => scepterAbility.scepter_skill_name)
    const shardList = aghsDesc
        .filter(shardAbility => shardAbility.shard_new_skill === true)
        .map(shardAbility => shardAbility.shard_skill_name)
    const basicAbilities = []

    Abilities.forEach((ability) => {
        const abilityName = abilityDesc[ability].dname
        if (
            scepterList.indexOf(abilityName) !== -1 ||
            shardList.indexOf(abilityName) !== -1 ||
            ability == "generic_hidden" ||
            ability.endsWith("_end")
            ) {
            
        } else {
            basicAbilities.push(ability)
        }
    })

    return(
        <div>
            {basicAbilities.map(ability => (
                <h1><AbilityCard ability={ability} /></h1>
            ))}
        </div>
        

    )
}

export default StaticBlock;