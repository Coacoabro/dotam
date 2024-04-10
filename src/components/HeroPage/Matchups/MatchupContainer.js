import React, { useState } from 'react';
import Link from 'next/link'

import heroName from '../../../../dotaconstants/build/heroes.json'

function MatchupContainer( {vs, heroes} ) {  
    return(
        <div className="bg-gray-600 p-3 rounded-md text-center">
            <div className="text-xl underline">{vs}</div>
            <div className="flex justify-evenly">
                <h1>Hero</h1>
                <h1>WR</h1>
                <h1>Matches</h1>
            </div>
            <div className="space-y-2">
                {heroes.map((hero) => {
                    return (
                        <div className="flex justify-between bg-gray-700 px-3 py-1 rounded-md items-center space-x-2">
                            <Link href={`/hero/${hero.Hero}`}>
                                <img   
                                    className="w-16" 
                                    src={`https://cdn.cloudflare.steamstatic.com${heroName[hero.Hero].img}`}
                                    title={heroName[hero.Hero].localized_name} 
                                />
                            </Link>
                            <div>{hero.WR}%</div>
                            <div>{hero.Matches}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MatchupContainer