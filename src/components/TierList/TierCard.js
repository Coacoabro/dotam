import React, { useState, useEffect } from 'react';
import Link from 'next/link'

import heroConstants from '../../../dotaconstants/build/heroes.json'

function TierCard({ tier_str, hero, WR, PR, matches, counters }){

    const [threeCounters, setThreeCounters] = useState([])

    useEffect(() => {
        if(counters) {
            const heroCounters = counters.herovs
            const reverseCounters = heroCounters.slice(-5).reverse()
            const finalCounters = []
            reverseCounters.map((hero) => {
                finalCounters.push(hero.Hero)
            })
            setThreeCounters(finalCounters)
        }
        
    }, [counters])

    if(!hero) return <div>Loading</div>;

    else{
        const heroName = hero.localized_name;
        const img = 'https://cdn.cloudflare.steamstatic.com' + hero.img;         

        return(
            <div className="flex space-x-1 text-white items-center py-2">
                <div className="rounded-md text-xl text-center w-36">{tier_str}</div>
                <Link href={`/hero/${hero.hero_id}`}>
                    <div className="rounded-md flex space-x-3 w-96 items-center">
                        <div className="w-32"><img src={img} alt={heroName} /></div>
                        <div className="text-2xl">{heroName}</div>
                    </div>
                </Link>
                <div className="w-48 rounded-md text-center text-xl">{(WR*100).toFixed(2)}%</div>
                <div className="w-48 rounded-md text-center text-xl">{(PR*1000).toFixed(2)}%</div>
                <div className="w-52 rounded-md text-center text-xl">{matches.toLocaleString()}</div>
                <div className="px-7 flex text-center text-xl">
                    {threeCounters.map((hero) => (
                        <Link href={`/hero/${hero}`}>
                            <img 
                                className="w-12" 
                                src={hero ? `https://cdn.cloudflare.steamstatic.com/${heroConstants[hero].icon}` : null} 
                                title={heroConstants[hero].localized_name}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        )
    }
    

}

export default TierCard;