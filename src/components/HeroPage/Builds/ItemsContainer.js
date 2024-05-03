import React, { useEffect, useState } from 'react';

import BuildTable from './BuildTable'
import StartingItems from '../Items/StartingItems'
import ItemOrderTable from './ItemOrderTable'

function ItemBuildsContainer({builds, items}) {

    if(builds) {
        const organizedBuilds = []
        const matches = builds[2]
        
        if(builds[4] && builds[8]) {
            builds[4].forEach((build) => {
                if(build.Matches/matches >= 0.0){
                    organizedBuilds.push({'Core': build.Core, 'PR': ((build.Matches/matches)*100).toFixed(2), 'WR': ((build.Wins/build.Matches)*100).toFixed(2), 'Matches': build.Matches})
                }
            })
    
            return(
                <div className="flex justify-evenly items-center">
                    <div>
                        <StartingItems items={items.starting} />
                        Early Game Items here
                    </div>
                    <BuildTable builds={organizedBuilds} />
                    {
                        organizedBuilds[0].Core.length == 2 ? (
                            builds.slice(7).map((build, index) => (
                                <ItemOrderTable items={build} order={(index + 3).toString()} />
                            ))
                        ) : builds.slice(8).map((build, index) => (
                            <ItemOrderTable items={build} order={(index + 4).toString()} />
                        ))
                    }
                </div>
            )
        }
    } else {return(<div>No one plays this hero with this role</div>)}
    

    
}

export default ItemBuildsContainer;