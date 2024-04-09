import React from 'react';

import ItemOrder from './ItemOrderContainer'
import StartingItems from './StartingItems'
import Extra from './Extra'

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function ItemBuildsContainer({build, boots, starting}) {

    return(
        <div className="flex justify-evenly px-2 space-x-8">
            <div>
                <StartingItems items={starting} />
                <Extra items={build["Extra"]} boots={boots}/>
            </div>
            <div className="space-y-3">
                <div className='underline text-xl text-white'>CORE ITEMS</div>
                <ItemOrder order='1ST' items={build["First"]}/>
                <ItemOrder order='2ND' items={build["Second"]}/>
                <ItemOrder order='3RD' items={build["Third"]}/>
            </div>
            <div>
                <div className='underline text-xl text-white'>LATE ITEMS</div>
                <div className="rounded-md p-2 bg-gray-600 text-white space-y-2">
                    {build["Late"].map((item) => (
                        <div className="flex space-x-2">
                            <img className="w-8"src={item.Item ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[item_ids[item.Item]].img  : null}/>
                            <div>{item ? item.Percentage : null}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ItemBuildsContainer;