import React, { useState } from 'react';

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function StartingItems({items}) {

    const startingItems = []

    items.forEach(item => {
        startingItems.push(item_ids[item])
    })

    return(
        <div>
            <div className='underline text-xl text-white'>STARTING ITEMS</div>
            <div className="grid grid-cols-3 gap-2 rounded-md p-2 bg-gray-600 text-white">
                <img className="w-8"src={startingItems[0] ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[startingItems[0]].img  : null}/>
                <img className="w-8"src={startingItems[1] ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[startingItems[1]].img  : null} />
                <img className="w-8"src={startingItems[2] ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[startingItems[2]].img  : null} />
                <img className="w-8"src={startingItems[3] ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[startingItems[3]].img  : null} />
                <img className="w-8"src={startingItems[4] ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[startingItems[4]].img  : null} />
                <img className="w-8"src={startingItems[5] ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[startingItems[5]].img  : null} />
            </div>
        </div>
    )
}

export default StartingItems