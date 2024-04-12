import React, { useState } from 'react';

import heroAbilities from '../../../dotaconstants/build/hero_abilities.json'
import abilityDesc from '../../../dotaconstants/build/abilities.json'
import aghsDesc from '../../../dotaconstants/build/aghs_desc.json'

function TalentCard({hero}) {
    
    const talentObject = heroAbilities[hero].talents

    const leftTalents = talentObject
        .filter((talent, index) => index % 2 === 0) // Get every other element
        .map(talent => talent.name) // Extract the 'name' value
        .reverse();
    const leftTalentNames = leftTalents.map(talent => (abilityDesc[talent].dname))

    const rightTalents = talentObject
        .filter((talent, index) => index % 2 === 1) // Get every other element
        .map(talent => talent.name) // Extract the 'name' value
        .reverse();
    const rightTalentNames = rightTalents.map(talent => (abilityDesc[talent].dname))

    
    const [showTooltip, setShowTooltip] = useState(false);

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    return (
        <div
            className="relative"
            onMouseEnter={toggleTooltip}
            onMouseLeave={toggleTooltip}
        >
            <img
                src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg"
                alt="Talent Tree"
                className="p-1 h-10 w-10 md:h-20 md:w-20"
            />
            {showTooltip && (
                <div 
                    className="absolute flex bg-black text-white p-2 rounded-md text-xs whitespace-pre-line"
                    style={{
                        left: '50%',
                        width: '500px',
                        height: 'auto',
                    }}
                    >
                    <div className="grid grid-rows-4 text-sm gap-1 p-1 h-60">
                        {rightTalentNames.map((talent) => (
                        <div key={talent} className="border border-gray-300 p-1">{talent}</div>
                        ))}
                    </div>
                    {/* Middle column with levels */}
                    <div className="grid grid-rows-4 text-lg gap-1 p-1">
                        {[25, 20, 15, 10].map(level => (
                            <div key={level} className="text-center border border-gray-300 p-1">
                                {level}
                            </div>
                        ))}
                    </div>
                    {/* First and third columns with hero talent information */}
                    <div className="grid grid-rows-4 text-sm gap-1 p-1">
                        {leftTalentNames.map((talent) => (
                        <div key={talent} className="border border-gray-300 p-1">{talent}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TalentCard;