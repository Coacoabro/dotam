import React, { useState } from 'react';

import NeutralItems from './NeutralItems';
import StartingItems from '../Builds/StartingItems';
import Boots from '../Builds/Boots';

function ItemsInfo() {

    return(
        <div className="bg-gray-500 p-3 space-y-5">
            <div className="flex justify-evenly">
                <StartingItems />
                <Boots />
            </div>
            
            <h1 className="text-center text-xl underline text-white">NEUTRAL ITEMS</h1>
            <div className="flex justify-evenly text-center">
                <NeutralItems tier="1" />
                <NeutralItems tier="2" />
                <NeutralItems tier="3" />
                <NeutralItems tier="4" />
                <NeutralItems tier="5" />
            </div>
            
        </div>
    )

}

export default ItemsInfo;