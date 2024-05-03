import React, { useState } from 'react';

import Item from '../../Item'

function StartingItems({items}) {

    const startingItems = []

    if (items) {
        items.forEach(item => {
            startingItems.push(item)
        })
    }

    return(
        <div className="bg-gray-700 p-1 rounded-md">
            <div className='text-xl text-white'>STARTING ITEMS</div>
            <div className="grid grid-cols-3 gap-2 rounded-md p-2 text-white place-items-center">
                {startingItems.map((item) => (
                    <Item id={item} width="12" />
                ))}
            </div>
        </div>
    )
}

export default StartingItems