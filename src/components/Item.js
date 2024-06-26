import React, { useEffect, useState } from 'react';

import itemIds from '../../dotaconstants/build/item_ids.json'
import itemConstants from '../../dotaconstants/build/items.json'
import itemComponents from '../json/components.json'

function Item({id, width, side, wr, time, matches, pr}) {
    
    const item = itemIds[id]
    const itemName = itemConstants[item].dname
    const itemImg = "https://cdn.cloudflare.steamstatic.com" + itemConstants[item].img
    const itemDesc = itemConstants[item].hint ? itemConstants[item].hint[0] : "Basic Stats"

    const itemComps = itemComponents[id]

    const showTooltip = (event) => {
        const tooltip = event.currentTarget.nextElementSibling;
        tooltip.style.visibility = 'visible';
    };

    const hideTooltip = (event) => {
        const tooltip = event.currentTarget.nextElementSibling;
        tooltip.style.visibility = 'hidden';
    };

    return(
        <div className="relative">
            <div className={`text-sm py-1 space-y-1 px-2 rounded-md ${wr || pr ? `w-24` : null} flex flex-col items-center justify-center relative`}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
            >
                {/*<h1 className="text-xs">{time ? '~ ' + time + ' min': null}</h1>
                <img className={`w-${width}`} src={itemImg}/>
                <h3 className="text-xs">{pr ? 'PR: ' + pr + '%' : null}</h3>
                <h3 className="text-xs">{wr ? 'WR: ' + wr + '%' : null}</h3>*/}
                <img className={`w-${width}`} src={itemImg}/>
            </div>
            
            <div
                className={`absolute bg-black text-white p-2 rounded-md text-xs whitespace-pre-line z-10`}
                style={{
                visibility: 'hidden',
                top: itemComps && width == 12 ? '-200%' : itemComps && width != 12 ? '-130%' : '-90%', // Adjust the position of the tooltip
                left: '50%', // Position the tooltip centrally
                transform: 'translateX(-50%)',
                width: '150px',
                height: 'auto',
                }}
            >
                <div className='space-y-2'>
                    <div className="text-sm text-center">
                        {itemName}
                    </div>
                    {itemComps ? (
                        <div className='space-y-1'>
                            <h1>Builds into:</h1>
                            <div className='flex justify-evenly'>   
                                {itemComps.map((compItem) => (
                                    <img src={"https://cdn.cloudflare.steamstatic.com" + itemConstants[itemIds[compItem]].img} className="w-8" key={compItem} />
                                ))}
                            </div>
                        </div>
                    ) : null}

                    

                    {/* <div className="text-xs text-left">
                        {}
                    </div> */}
                </div>
            </div>
            
        </div>
    )
    


}

export default Item;