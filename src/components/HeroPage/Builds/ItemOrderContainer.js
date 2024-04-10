import React, { useState } from 'react';

import Item from '../../Item'

function ItemOrder({order, items}) {

    const build = items.Build
    const percentage = items.Percentage
    
    return(
        <div className="rounded-md p-2 bg-gray-600 text-white flex space-x-2 items-center">
            <div>{order}</div>
            <div className="grid grid-cols-3 gap-2 text-center">
                {build.map((item) => (
                    <Item id={item} width="12" />
                ))}
            </div>
            <div>{percentage}</div>
        </div>
    )
}

export default ItemOrder