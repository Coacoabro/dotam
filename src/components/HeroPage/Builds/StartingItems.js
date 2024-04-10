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
        <div>
            <div className='underline text-xl text-white'>STARTING ITEMS</div>
            <div className="grid grid-cols-3 gap-2 rounded-md p-2 bg-gray-600 text-white">
                {startingItems.map((item) => (
                    <Item id={item} width="10" />
                ))}
            </div>
        </div>
    )
}

export default StartingItems