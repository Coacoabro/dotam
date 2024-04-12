import React, { useState } from 'react';

import scepterImage from "../../../public/scepter_0.png"
import shardImage from "../../../public/shard_0.png"

import heroAbilities from '../../../dotaconstants/build/hero_abilities.json'
import abilityDesc from '../../../dotaconstants/build/abilities.json'
import aghsDesc from '../../../dotaconstants/build/aghs_desc.json'


function AghsCard({hero}) {
    
    const Abilities = heroAbilities[hero].abilities
    const heroObject = aghsDesc.find(obj => obj.hero_name === hero)
    const abilitiesArray = Object.values(abilityDesc)

    const scepterName = heroObject.scepter_skill_name
    const scepterDesc = heroObject.scepter_desc
    const scepterAbilityObject = abilitiesArray.find(ability => ability.dname === scepterName)
    const scepterImg = 'https://cdn.cloudflare.steamstatic.com/' + scepterAbilityObject.img

    const shardName = heroObject.shard_skill_name
    const shardDesc = heroObject.shard_desc
    const shardAbilityObject = abilitiesArray.find(ability => ability.dname === shardName)
    const shardImg = 'https://cdn.cloudflare.steamstatic.com/' + shardAbilityObject.img

    

    
    const [tooltipInfo, setTooltipInfo] = useState(null);
    const handleHover = (abilityType) => {
        if (abilityType === 'Scepter') {
            setTooltipInfo({ name: scepterName, image: scepterImg, desc: scepterDesc });
          } else if (abilityType === 'Shard') {
            setTooltipInfo({ name: shardName, image: shardImg, desc: shardDesc });
          } else {
            setTooltipInfo(null);
          }
      };
    
      return (
        <div className="flex relative p-1 h-10 md:h-20 md:w-20">
            <div>
                <div className="mr-4 p-1">
                    <img
                    src="https://www.opendota.com/assets/images/dota2/scepter_0.png"
                    alt="Scepter"
                    className="w-5 h-5 md:w-10 md:h-10"
                    onMouseEnter={() => handleHover('Scepter')}
                    onMouseLeave={() => handleHover('')}
                    />
                </div>
                <div>
                    <img
                    src="https://www.opendota.com/assets/images/dota2/shard_0.png"
                    alt="Shard"
                    className="w-7 h-4 md:w-12 md:h-7"
                    onMouseEnter={() => handleHover('Shard')}
                    onMouseLeave={() => handleHover('')}
                    />
                </div>
            </div>
            
            {tooltipInfo && (
                <div
                    className="absolute bg-black flex text-white p-1 rounded-md text-xs whitespace-pre-line"
                    style={{
                    left: '50%', // Position the tooltip centrally
                    top: '110%',
                    transform: 'translateX(-50%)',
                    width: '300px', // Adjust width as needed
                    height: 'auto', // Let the height expand according to content
                }}
                >
                    <img src={tooltipInfo.image} alt={tooltipInfo.name} className="w-20 h-20 p-2" />
                    <div>
                        <div className="text-lg">{tooltipInfo.name}</div>
                        <div>{tooltipInfo.desc}</div>
                    </div>
                </div>
            )}

        </div>
        
          
        
      );
}

export default AghsCard;