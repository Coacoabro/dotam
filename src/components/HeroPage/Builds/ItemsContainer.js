import React from 'react';

import ItemOrder from './ItemOrderContainer'
import StartingItems from './StartingItems'
import Boots from './Boots'

function ItemBuildsContainer({items}) {
    return(
        <div className="bg-gray-500 p-3 space-y-5">
            <div className="flex justify-evenly px-2 space-x-8">
                <StartingItems />
                <Boots />                
            </div>
            <div className="flex justify-between px-4">
                <ItemOrder order='1ST' items={items["First"]}/>
                <ItemOrder order='2ND' items={items["Second"]}/>
                <ItemOrder order='3RD' items={items["Third"]}/>
                <ItemOrder order='4TH' items={items["Fourth"]}/>
                <ItemOrder order='5TH' items={items["Fifth"]}/>
                <ItemOrder order='6TH' items={items["Sixth"]}/>
            </div>            
        </div>
    )
}

export default ItemBuildsContainer;