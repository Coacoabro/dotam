import React, { useEffect, useState } from 'react';

import itemIds from '../../dotaconstants/build/item_ids.json'
import itemConstants from '../../dotaconstants/build/items.json'

function Item({id, width, side}) {

    const item = itemIds[id]
    const itemName = itemConstants[item].dname
    const itemImg = "https://cdn.cloudflare.steamstatic.com" + itemConstants[item].img
    const itemDesc = itemConstants[item].hint ? itemConstants[item].hint[0] : "Basic Stats"

    const showTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'visible';
    };

    const hideTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'hidden';
    };

    return(
        <div className="relative">
            <img className={`w-${width}`} src={itemImg}                    
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
            />
            <div
                className={`absolute bg-black text-white p-1 rounded-md text-xs whitespace-pre-line z-10`}
                style={{
                visibility: 'hidden',
                top: '50%', // Adjust the position of the tooltip
                left: '-140%', // Position the tooltip centrally
                transform: 'translateX(-50%)',
                width: '150px',
                height: 'auto', // Let the height expand according to content
                }}
            >
                <div>
                    <div className="text-sm underline">
                        {itemName}
                    </div>
                    
                    <div className="text-xs">
                        {itemDesc}
                    </div>
                </div>
            </div>
        </div>
    )
    


}

export default Item;