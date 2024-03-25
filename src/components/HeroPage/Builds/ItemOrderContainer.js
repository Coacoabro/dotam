import React, { useState } from 'react';

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import items from '../../../../dotaconstants/build/items.json'

function ItemOrder({order, items}) {

    return(
        <div className="rounded-md p-2 bg-gray-600 text-white">
            <div className='text-center underline text-xl'>{order}</div>
            <div className="grid grid-cols-2 gap-2 text-center">
                <div>ITEM</div>
                <div>PICK</div>
                <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <div>{items[0].Percentage}%</div>
                <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <div>{items[1].Percentage}%</div>
                <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <div>{items[2].Percentage}%</div>
            </div>
        </div>
    )
}

export default ItemOrder