import React, { useEffect, useState } from 'react';

import Item from '../../Item'

function Extra({items, boots}) {

    const earlyFinal = []
    const lateFinal = []

    let totalMatches = 0

    boots.Early.forEach((obj) => {
        totalMatches += obj.Matches
    })
    boots.Early.forEach((obj) => {
        if (obj.Matches/totalMatches > 0.025) {
            earlyFinal.push({'Item': obj.Item, 'Matches': obj.Matches, 'Percentage': (obj.Matches/totalMatches*100).toFixed(2), 'Time': (obj.Time/60).toFixed(0)})
        }
    })
    totalMatches = 0
    boots.Late.forEach((obj) => {
        totalMatches += obj.Matches
    })
    boots.Late.forEach((obj) => {
        if (obj.Matches/totalMatches > 0.025) {
            lateFinal.push({'Item': obj.Item, 'Matches': obj.Matches, 'Percentage': (obj.Matches/totalMatches*100).toFixed(2), 'Time': (obj.Time/60).toFixed(0)})
        }
    })

    return(
        <div className='text-white bg-gray-700 rounded-md'>
            <div className='text-xl'>BOOTS</div>
            <div className="flex space-x-2 justify-evenly">
                <div className="rounded-md p-2 text-white space-y-3">
                    <div className='text-white'>EARLY</div>
                    {earlyFinal.map((item, index) => (
                        <div className="text-xs">
                            <Item id={item.Item} width="12" matches={item.Matches} pr={item.Percentage} time={item.Time} />
                        </div>
                    ))}
                </div>
                <div className="rounded-md p-2 text-white space-y-3">
                    <div className='text-white'>LATE</div>
                    {lateFinal.map((item, index) => (
                        <div className="text-xs">
                            <Item id={item.Item} width="12" matches={item.Matches} pr={item.Percentage} time={item.Time} />
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    )
}

export default Extra