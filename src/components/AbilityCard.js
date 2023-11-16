import React, { useState } from 'react';
import Link from 'next/link';

import heroAbilities from '../../dotaconstants/build/hero_abilities.json'
import Abilities from '../../dotaconstants/build/abilities.json'

function AbilityCard({ability}) {
    const abilityInfo = Abilities[ability]
    return(
        <div className="p-2 h-16 w-16">
            <img src={'https://steamcdn-a.akamaihd.net/' + abilityInfo.img} alt={abilityInfo.dname} />
        </div>
        
    )
    
}

export default AbilityCard;