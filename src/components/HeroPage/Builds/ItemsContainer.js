import React, { useEffect, useState } from 'react';

import BuildTable from './BuildTable'
import Early from './Early'
import StartingItems from '../Items/StartingItems'
import ItemOrderTable from './ItemOrderTable'

function ItemBuildsContainer({builds, items}) {

    if(builds) {
        
        const organizedBuilds = []
        const matches = builds.total_matches

        if(builds.core && builds.item04) {
            builds.core.forEach((build) => {
                if(build.Matches/matches >= 0.0){
                    organizedBuilds.push({'Core': build.Core, 'PR': ((build.Matches/matches)*100).toFixed(2), 'WR': ((build.Wins/build.Matches)*100).toFixed(2), 'Matches': build.Matches})
                }
            })
    
            return(
                <div className="flex justify-evenly items-center text-white">
                    <div className="space-y-3">
                        <StartingItems items={items.starting} />
                        <Early items={builds.early} matches={matches} />
                    </div>
                    <BuildTable builds={organizedBuilds} />
                    {organizedBuilds[0].Core.length === 2 ? (
                        Object.keys(builds).slice(7).map((key, index) => (
                            <ItemOrderTable items={builds[key]} order={(index + 3).toString()} matches={matches} />
                        ))
                    ) : (
                        Object.keys(builds).slice(8).map((key, index) => (
                            <ItemOrderTable items={builds[key]} order={(index + 4).toString()} matches={matches} />
                        ))
                    )}
                </div>
            )
        }
    } else {return(<div className="bg-gray-700 text-center text-white p-3 rounded-md text-xl">No one plays this hero with this role. Go to the Item Tab for more info</div>)}
    

    
}

export default ItemBuildsContainer;