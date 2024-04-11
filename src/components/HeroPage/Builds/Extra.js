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
        if (obj.Matches/totalMatches > 0.01) {
            earlyFinal.push({'Item': obj.Item, 'Percentage': (obj.Matches/totalMatches*100).toFixed(2)})
        }
    })
    totalMatches = 0
    boots.Late.forEach((obj) => {
        totalMatches += obj.Matches
    })
    boots.Late.forEach((obj) => {
        if (obj.Matches/totalMatches > 0.01) {
            lateFinal.push({'Item': obj.Item, 'Percentage': (obj.Matches/totalMatches*100).toFixed(2)})
        }
    })

    return(
        <div>
            <div className='underline text-xl text-white'>BOOTS</div>
            <div className="flex space-x-2">
                <div className="rounded-md p-2 bg-gray-600 text-white space-y-3">
                    <div className='text-white'>EARLY</div>
                    {earlyFinal.map((item, index) => (
                        <div className="flex">
                            <Item id={item.Item} width="12"/>
                            <div>{item? item.Percentage + '%' : null}</div>
                        </div>
                    ))}
                </div>
                <div className="rounded-md p-2 bg-gray-600 text-white space-y-3">
                    <div className='text-white'>LATE</div>
                    {lateFinal.map((item, index) => (
                        <div className="flex">
                            <Item id={item.Item} width="12"/>
                            <div>{item ? item.Percentage : null}%</div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    )
}

export default Extra