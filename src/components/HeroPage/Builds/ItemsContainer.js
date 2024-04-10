import React, { useEffect, useState } from 'react';

import Item from '../../Item'
import ItemOrder from './ItemOrderContainer'
import NeutralItems from '../Items/NeutralItems';
import StartingItems from './StartingItems'
import Extra from './Extra'

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function ItemBuildsContainer({build, boots, starting, neutrals}) {

    const [neutralArray, setNeutralArray] = useState([])


    useEffect(() => {
        if(neutrals){setNeutralArray(neutrals)}
    },[neutrals])

    return(
        <div className="space-y-8">
            <div className="flex justify-evenly px-2 space-x-8">
                <div className="space-y-2">
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
                                <Item id={item.Item} width="12" />
                                <div>{item ? item.Percentage : null}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-evenly text-center">
                <NeutralItems tier="1" neutrals={neutralArray["Tier 1"]} />
                <NeutralItems tier="2" neutrals={neutralArray["Tier 2"]} />
                <NeutralItems tier="3" neutrals={neutralArray["Tier 3"]} />
                <NeutralItems tier="4" neutrals={neutralArray["Tier 4"]} />
                <NeutralItems tier="5" neutrals={neutralArray["Tier 5"]} />
            </div>
        </div>
        
    )
}

export default ItemBuildsContainer;