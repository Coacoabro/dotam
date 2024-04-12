import React, { useEffect, useState } from 'react';

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

import Item from '../../Item'

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
        <div className={`bg-gray-700 space-y-3 text-white p-2 rounded-md`}>
            <h1 className="text-center text-xl">TIER {tier}</h1>
            <div className="grid grid-cols-1 gap-2 place-items-center">
                {neutralList.map((item) => (
                    <div>
                        <Item id={item.Item} width="12" />
                        <div>{item ? item.Matches : null}</div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default NeutralItems;