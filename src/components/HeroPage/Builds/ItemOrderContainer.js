import React, { useState } from 'react';

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function ItemOrder({order, items}) {

    const build = items.Build
    const percentage = items.Percentage
    
    return(
        <div className="rounded-md p-2 bg-gray-600 text-white flex space-x-2 items-center">
            <div>{order}</div>
            <div className="grid grid-cols-3 gap-2 text-center">
                {build.map((item) => (
                    <img className="w-12"src={item ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[item_ids[item]].img  : null}/>
                ))}
            </div>
            <div>{percentage}</div>
        </div>
    )
}

export default ItemOrder