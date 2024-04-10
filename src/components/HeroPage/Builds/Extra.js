import React, { useEffect, useState } from 'react';

import Item from '../../Item'

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