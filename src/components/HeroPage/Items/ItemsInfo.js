import React, { useEffect, useState } from 'react';

import NeutralItems from './NeutralItems';
import StartingItems from './StartingItems'
import ItemTable from './ItemTable';

function ItemsInfo({heroID, items}) {

    const {boots, starting, main, neutrals} = items

    const [loaded, setLoaded] = useState(false)
    const [neutralArray, setNeutralArray] = useState([])
    const [early, setEarly] = useState([])
    const [core, setCore] = useState([])
    const [late, setLate] = useState([])
    const [allBoots, setAllBoots] = useState([])

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

            setAllBoots([...boots.Early, ...boots.Late]);

            setLoaded(true)
        }
    },[neutrals, main, boots])
    
    if(loaded) {
        return(
            <div className="bg-gray-500 p-3 space-y-5 rounded-tr-md rounded-b-md text-center">
                <div className="space-y-8 p-2">  
                    <div className="flex justify-evenly">
                        <div className="space-y-2 md:w-64">
                            <StartingItems items={starting} />
                        </div>   
                        <div className="text-white bg-gray-600 p-2 space-y-2 rounded-md">
                            <h1 className="text-lg">BOOTS</h1>
                            <ItemTable items={allBoots}/>
                        </div>
                    </div>
                            
                    <div className="flex justify-evenly px-2 space-x-8 space-y-2">
                        
                        <div className="text-white bg-gray-600 p-2 space-y-2 rounded-md">
                            <h1 className="text-2xl">EARLY</h1>
                            <h2 className='text-sm'>Items to help with the early game</h2>
                            <ItemTable items={early} />
                        </div>
                        <div className="text-white bg-gray-600 p-2 space-y-2 rounded-md">
                            <h1 className="text-2xl">CORE</h1>
                            <h2 className='text-sm'>Items before 30 min</h2>
                            <ItemTable items={core} />
                        </div>
                        <div className="text-white bg-gray-600 p-2 space-y-2 rounded-md">
                            <h1 className="text-2xl">LATE</h1>
                            <h2 className='text-sm'>Items after 30 min</h2>
                            <ItemTable items={late} />
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
            </div>
        )
    }
}

export default ItemsInfo;