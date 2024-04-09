import React, { useEffect, useState } from 'react';

import NeutralItems from './NeutralItems';

function ItemsInfo({heroID, items}) {

    const [neutrals, setNeutrals] = useState([])


    useEffect(() => {
        if(items){setNeutrals(items.neutrals)}
    },[items])

    console.log(neutrals)
    

    return(
        <div className="bg-gray-500 p-3 space-y-5 rounded-tr-md rounded-b-md">
            <div>Items</div>
            <h1 className="text-center text-xl underline text-white">NEUTRAL ITEMS</h1>
            <div className="flex justify-evenly text-center">
                <NeutralItems tier="1" neutrals={neutrals["Tier 1"]} />
                <NeutralItems tier="2" neutrals={neutrals["Tier 2"]} />
                <NeutralItems tier="3" neutrals={neutrals["Tier 3"]} />
                <NeutralItems tier="4" neutrals={neutrals["Tier 4"]} />
                <NeutralItems tier="5" neutrals={neutrals["Tier 5"]} />
            </div>
            
        </div>
    )

}

export default ItemsInfo;