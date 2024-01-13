import React, { useState, useEffect } from 'react';
import Link from 'next/link'

import heroNames from '../../../dotaconstants/build/heroes.json';

function TierCalc(score) {
    let t
    if(score > 3) {
        t = 'S+'
    }
    else if (score >= 2) {
        t = 'S'
    }
    else if (score >= 1) {
        t = 'A'
    }
    else if (score >= 0) {
        t = 'B'
    }
    else if (score >= -1) {
        t = 'C'
    }
    else if (score >= -2) {
        t = 'D'
    }
    else {
        t = 'F'
    }
    return t
}


function TierCard({ score, heroId, WR, PR, matches }){

    const [heroObj, setHeroObj] = useState(null);
    const [heroMatches, setHeroMatches] = useState(null);

    useEffect(() => {
        if(heroNames && matches){
            setHeroObj(heroNames[heroId]);
            setHeroMatches(matches.toLocaleString())
        }
    }, [heroId, matches]);

    const heroName = heroObj ? heroObj.localized_name : '';
    const dotaImg = heroObj ? heroObj.img : '';
    const img = 'https://cdn.cloudflare.steamstatic.com/' + dotaImg;

    const tier = TierCalc(score)
    
    

    return(
        <div className="flex space-x-1">
            <div className="px-8 rounded-md justify-center">{tier}</div>
            <Link href={`/hero/${heroId}`}>
                <div className="p-2 rounded-md flex space-x-3">
                    <div className="w-32 h-24"><img src={img} alt={heroName} /></div>
                    <div className="text-2xl justify-end">{heroName}</div>
                </div>
            </Link>
            <div className="px-8 rounded-md justify-center text-xl">{(WR*100).toFixed(2)}%</div>
            <div className="px-8 rounded-md justify-center text-xl">{(PR*100).toFixed(2)}%</div>
            <div className="px-8 rounded-md justify-center text-lg">{heroMatches}</div>
            <div className="px-24 rounded-md justify-center">Stuff</div>
        </div>
    )
}

export default TierCard;