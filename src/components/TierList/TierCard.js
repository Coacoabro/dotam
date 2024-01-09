import React, { useState, useEffect } from 'react';

import heroNames from '../../../dotaconstants/build/heroes.json';


function TierCard({ tier, heroId, WR, PR, matches }){

    const [heroObj, setHeroObj] = useState(null);
    const [heroMatches, setHeroMatches] = useState(null);

    useEffect(() => {
        if(heroNames && matches){
            setHeroObj(heroNames[heroId]);
            setHeroMatches(matches);
        }
    }, [heroId]);

    const heroName = heroObj ? heroObj.localized_name : '';
    const dotaImg = heroObj ? heroObj.img : '';
    const img = 'https://cdn.cloudflare.steamstatic.com/' + dotaImg;
    const displayMatches = heroMatches ? heroMatches.toLocaleString() : "";
    

    return(
        <div className="flex space-x-1">
            <div className="px-8 rounded-md bg-gray-600">{tier}</div>
            <div className="px-32 rounded-md bg-gray-600 flex">
                <img src={img} alt={heroName} />
                {heroName}
            </div>
            <div className="px-8 rounded-md bg-gray-600">{(WR*100).toFixed(2)}%</div>
            <div className="px-8 rounded-md bg-gray-600">{(PR*100).toFixed(2)}%</div>
            <div className="px-8 rounded-md bg-gray-600">{displayMatches}</div>
            <div className="px-24 rounded-md bg-gray-600">Stuff</div>
        </div>
    )
}

export default TierCard;