import React, { useEffect, useState } from 'react';

import Item from '../../Item'
import ItemOrder from './ItemOrderContainer'
import NeutralItems from '../Items/NeutralItems';
import StartingItems from './StartingItems'
import Extra from './Extra'

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function ItemBuildsContainer({build, boots, starting, main, neutrals}) {

    const [loaded, setLoaded] = useState(false)
    const [neutralArray, setNeutralArray] = useState([])
    const [early, setEarly] = useState([])
    const [core, setCore] = useState([])
    const [late, setLate] = useState([])

    useEffect(() => {
        setLoaded(false)
        if(neutrals && main) {
            setNeutralArray(neutrals)
            if(main.Early[0]){
                let maxMatches = main.Early[0].Matches
                setEarly(main.Early
                    .filter(item => (item.Matches / maxMatches) >= 0.05)
                    .sort((a, b) => a.Time - b.Time)
                );
            } else {setEarly("Not enough data")}
            
            if(main.Core[0]){
                let maxMatches = main.Core[0].Matches
                setCore(main.Core
                    .filter(item => (item.Matches / maxMatches) >= 0.05)
                    .sort((a, b) => a.Time - b.Time)
                );
            } else {setCore("Not enough data")}

            if(main.Late[0]){
                let maxMatches = main.Late[0].Matches
                setLate(main.Late
                    .filter(item => (item.Matches / maxMatches) >= 0.05)
                    .sort((a, b) => a.Time - b.Time)
                );
            } else {setLate("Not enough data")}

            setLoaded(true)
        }
    },[neutrals, main])

    if(loaded) {
        return(
            <div className="space-y-8">
                <div className="md:grid md:grid-cols-3 md:place-items-center px-2 space-x-8 space-y-2">
                    <div className="space-y-2 md:w-64">
                        <StartingItems items={starting} />
                        <Extra boots={boots}/>
                    </div>
                    <div>
                        <ItemOrder early={early} core={core} late={late} />
                    </div>
                    <div className='text-white bg-gray-700 px-4 rounded-md md:w-64'>
                        <h1 className='text-lg'>LATE</h1>
                        <div className="grid grid-cols-3 gap-3">
                            {Array.isArray(late) ? late.map((item) => (
                                <Item id={item.Item} width="12" wr={item.WR} matches={item.Matches} time={item.Time} />
                            )) : "Not enough data"}
                        </div>
                    </div>
                    
                </div>
                <div className='rounded-md p-2 space-y-2'>
                    <h1 className="text-center text-xl text-white">NEUTRAL ITEMS</h1>
                    <div className="flex justify-center space-y-1">
                        <div className="flex justify-evenly text-center space-x-2">
                            <NeutralItems tier="1" neutrals={neutralArray["Tier 1"]} />
                            <NeutralItems tier="2" neutrals={neutralArray["Tier 2"]} />
                            <NeutralItems tier="3" neutrals={neutralArray["Tier 3"]} /> 
                            <NeutralItems tier="4" neutrals={neutralArray["Tier 4"]} />
                            <NeutralItems tier="5" neutrals={neutralArray["Tier 5"]} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default ItemBuildsContainer;