import React from 'react';

import ItemOrder from './ItemOrderContainer'
import StartingItems from './StartingItems'
import Boots from './Boots'

function ItemBuildsContainer() {
    return(
        <div className="bg-gray-500 p-3 space-y-5">
            <div className="flex justify-evenly px-2 space-x-8">
                <StartingItems />
                <Boots />                
            </div>
            <div className="flex justify-between px-4">
                <ItemOrder className="bg-gray-700" order='1ST' items='List'/>
                <ItemOrder order='2ND' items='List'/>
                <ItemOrder order='3RD' items='List'/>
                <ItemOrder order='4TH' items='List'/>
                <ItemOrder order='5TH' items='List'/>
            </div>
            <div className="flex justify-evenly">
                <NeutralItems items="list" tier="1" />
                <NeutralItems items="list" tier="2" />
                <NeutralItems items="list" tier="3" />
                <NeutralItems items="list" tier="4" />
                <NeutralItems items="list" tier="5" />
            </div>
            
        </div>
    )
}

export default ItemBuildsContainer;