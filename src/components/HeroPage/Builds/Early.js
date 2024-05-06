import React, { useEffect, useState } from 'react';

import Item from '../../Item'

function Early({items, matches}) {

    console.log(items, matches)

    const earlyFinal = []

    items.map((item) => {
        if(item.Matches/matches >= 0.33) {
            earlyFinal.push({'Item': item.Item, 'Matches': item.Matches})
        }
    })
    earlyFinal.sort((a, b) => b.Matches - a.Matches)

    return(
        <div className='text-white bg-gray-700 rounded-md w-60 p-1'>
            <div className='text-xl'>EARLY ITEMS</div>
            <div className="flex space-x-2 justify-evenly">
                <div className="rounded-md p-2 text-white space-y-3">
                    {/* <h1 className='text-white'>Buy these every game</h1> */}
                    <div className="flex flex-wrap justify-between">
                        {earlyFinal.map((item) => (
                            <div className="text-xs">
                                <Item id={item.Item} width={12} />
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Early