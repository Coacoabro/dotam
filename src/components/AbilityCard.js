import React, { useState } from 'react';
import Link from 'next/link';

import heroAbilities from '../../dotaconstants/build/hero_abilities.json'
import Abilities from '../../dotaconstants/build/abilities.json'

function AbilityCard({ability}) {
    const abilityInfo = Abilities[ability]
    console.log(ability)
    return(
        <img src={'https://steamcdn-a.akamaihd.net/' + abilityInfo.img} alt={abilityInfo.dname} />
    )
    
}

export default AbilityCard;