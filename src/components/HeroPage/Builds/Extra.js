import React, { useState } from 'react';

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function Extra({items}) {

    return(
        <div>
            <div className='underline text-xl text-white'>EXTRAS</div>
            <div className="grid grid-cols-2 gap-2 rounded-md p-2 bg-gray-600 text-white">
                {items.map((item, index) => (
                    <div className="flex">
                        <img className="w-8"src={item.Item ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[item_ids[item.Item]].img  : null}/>
                        <div>{item ? item.Percentage : null}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Extra