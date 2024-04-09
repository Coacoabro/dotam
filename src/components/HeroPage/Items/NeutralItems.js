import React, { useEffect, useState } from 'react';

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function NeutralItems({tier, neutrals}) {

    const showTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'visible';
    };

    const hideTooltip = (event) => {
        const tooltip = event.target.nextElementSibling;
        tooltip.style.visibility = 'hidden';
    };

    const [neutralList, setNeutralList] = useState([])

    useEffect(() => {
        if(neutrals){
            setNeutralList(neutrals)
        }
    },[neutrals])

    return(
        <div className='bg-gray-600 text-white p-3 rounded-md'>
            <div className="underline">TIER {tier}</div>
            <div className="grid grid-cols-1 gap-2">
                <div>ITEM MATCHES</div>
                {neutralList.map((item) => (
                    <div className="flex space-x-1 justify-between items-center">
                        <div className="relative">
                            <img className="w-16" src={item.Item ? "https://cdn.cloudflare.steamstatic.com" + itemConstants[item_ids[item.Item]].img  : null}                    
                                onMouseEnter={showTooltip}
                                onMouseLeave={hideTooltip}
                            />
                            <div
                                className="absolute bg-black text-white p-1 rounded-md text-xs whitespace-pre-line"
                                style={{
                                visibility: 'hidden',
                                top: '50%', // Adjust the position of the tooltip
                                left: '-125%', // Position the tooltip centrally
                                transform: 'translateX(-50%)',
                                width: '100px', // Adjust width as needed
                                height: 'auto', // Let the height expand according to content
                                }}
                            >
                                <div className="text-sm">{itemConstants[item_ids[item.Item]].dname}</div>
                            </div>
                        </div>
                        <div>{item ? item.Matches : null}</div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default NeutralItems;