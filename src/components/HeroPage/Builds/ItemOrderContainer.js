import React, { useState } from 'react';

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function ItemOrder({order, items}) {

    const firstItem = item_ids[items[0].Item]
    const firstImg = "https://cdn.cloudflare.steamstatic.com" + itemConstants[firstItem].img
    const secondItem = items[1] ? item_ids[items[1].Item] : null;
    const secondImg = items[1] ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[secondItem].img : null;
    const thirdItem = items[2] ? item_ids[items[2].Item] : null;
    const thirdImg = items[2] ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[thirdItem].img : null;

    return(
        <div className="rounded-md p-2 bg-gray-600 text-white">
            <div className='text-center underline text-xl'>{order}</div>
            <div className="grid grid-cols-2 gap-2 text-center">
                <div>ITEM</div>
                <div>PICK</div>
                <img className="w-8" src={firstImg}/>
                <div>{items[0].Percentage}%</div>
                <img className="w-8" src={secondImg}/>
                <div>{items[1] ? `${items[1].Percentage}%` : null}</div>
                <img className="w-8" src={thirdImg}/>
                <div>{items[2] ? `${items[2].Percentage}%` : null}</div>
            </div>
        </div>
    )
}

export default ItemOrder