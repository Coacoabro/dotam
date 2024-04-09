import React, { useEffect, useState } from 'react';

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function Extra({items, boots}) {

    const [earlyBoots, setEarlyBoots] = useState([])
    const [lateBoots, setLateBoots] = useState([])

    const earlyFinal = []
    const lateFinal = []

    useEffect(() => {
        if(boots){
            setEarlyBoots(boots.Early)
            setLateBoots(boots.Late)
        }
    }, [boots])

    let totalMatches = 0

    earlyBoots.forEach((obj) => {
        totalMatches += obj.Matches
    })
    earlyBoots.forEach((obj) => {
        if (obj.Matches/totalMatches > 0.01) {
            earlyFinal.push({'Item': obj.Item, 'Percentage': (obj.Matches/totalMatches*100).toFixed(2)})
        }
    })
    totalMatches = 0
    lateBoots.forEach((obj) => {
        totalMatches += obj.Matches
    })
    lateBoots.forEach((obj) => {
        if (obj.Matches/totalMatches > 0.01) {
            lateFinal.push({'Item': obj.Item, 'Percentage': (obj.Matches/totalMatches*100).toFixed(2)})
        }
    })

    return(
        <div>
            <div className='underline text-xl text-white'>BOOTS</div>
            <div className='text-white'>EARLY</div>
            <div className="grid grid-cols-2 gap-2 rounded-md p-2 bg-gray-600 text-white">
                {earlyFinal.map((item, index) => (
                    <div className="flex space-x-1">
                        <img className="w-8"src={item.Item ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[item_ids[item.Item]].img  : null}/>
                        <div>{item ? item.Percentage : null}%</div>
                    </div>
                ))}
            </div>
            <div className='text-white'>LATE</div>
            <div className="grid grid-cols-2 gap-2 rounded-md p-2 bg-gray-600 text-white">
                {lateFinal.map((item, index) => (
                    <div className="flex space-x-1">
                        <img className="w-8"src={item.Item ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[item_ids[item.Item]].img  : null}/>
                        <div>{item ? item.Percentage : null}%</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Extra