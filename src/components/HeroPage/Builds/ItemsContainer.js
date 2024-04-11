import React, { useEffect, useState } from 'react';

import Item from '../../Item'
import ItemOrder from './ItemOrderContainer'
import NeutralItems from '../Items/NeutralItems';
import StartingItems from './StartingItems'
import Extra from './Extra'

import item_ids from '../../../../dotaconstants/build/item_ids.json'
import itemConstants from '../../../../dotaconstants/build/items.json'

function ItemBuildsContainer({build, boots, starting, main, neutrals}) {

    const [neutralArray, setNeutralArray] = useState([])
    const [early, setEarly] = useState([])
    const [core, setCore] = useState([])
    const [late, setLate] = useState([])

    useEffect(() => {
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
        }
    },[neutrals, main])

    console.log(neutralArray)

    return(
        <div className="space-y-8">
            <div className="flex justify-evenly px-2 space-x-8">
                <div className="space-y-2">
                    <StartingItems items={starting} />
                    <Extra boots={boots}/>
                </div>
                <div>
                    <h1 className="text-center text-xl text-white underline">ITEM BUILD</h1>
                    <ItemOrder early={early} core={core} late={late} />
                </div>
            </div>
            <div className="space-y-1">
                <h1 className="text-center text-xl text-white underline">NEUTRAL ITEMS</h1>
                <div className="flex justify-evenly text-center">
                    {neutralArray["Tier 1"][0] ? <NeutralItems tier="1" neutrals={neutralArray["Tier 1"]} /> : null}
                    {neutralArray["Tier 2"][0] ? <NeutralItems tier="2" neutrals={neutralArray["Tier 2"]} /> : null}
                    {neutralArray["Tier 3"][0] ? <NeutralItems tier="3" neutrals={neutralArray["Tier 3"]} /> : null}   
                    {neutralArray["Tier 4"][0] ? <NeutralItems tier="4" neutrals={neutralArray["Tier 4"]} /> : null}
                    {neutralArray["Tier 5"][0] ? <NeutralItems tier="5" neutrals={neutralArray["Tier 5"]} /> : null}
                </div>
            </div>
            
        </div>
        
    )
}

export default ItemBuildsContainer;