import React, { useState } from 'react';

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function ItemOrder({order, items}) {

    const firstItem = item_ids[items[0].Item]
    const firstImg = "https://cdn.cloudflare.steamstatic.com" + itemConstants[firstItem].img
    const secondItem = item_ids[items[1].Item]
    const secondImg = "https://cdn.cloudflare.steamstatic.com" + itemConstants[secondItem].img
    const thirdItem = item_ids[items[2].Item]
    const thirdImg = "https://cdn.cloudflare.steamstatic.com" + itemConstants[thirdItem].img

    return(
        <div className="rounded-md p-2 bg-gray-600 text-white">
            <div className='text-center underline text-xl'>{order}</div>
            <div className="grid grid-cols-2 gap-2 text-center">
                <div>ITEM</div>
                <div>PICK</div>
                <img className="w-8" src={firstImg} alt={itemConstants[firstItem].dname}/>
                <div>{items[0].Percentage}%</div>
                <img className="w-8" src={secondImg} alt={itemConstants[secondItem].dname}/>
                <div>{items[1].Percentage}%</div>
                <img className="w-8" src={thirdImg} alt={itemConstants[thirdItem].dname}/>
                <div>{items[2].Percentage}%</div>
            </div>
        </div>
    )
}

export default ItemOrder