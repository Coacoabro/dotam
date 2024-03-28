import React, { useState } from 'react';

import AbilitiesContainer from './AbilitiesContainer';
import TalentsContainer from './TalentsContainer';
import ItemsContainer from './ItemsContainer';


function BuildsInfo({heroID, builds}) {

    const items = builds[0].items
    const abilities = builds[0].abilities

    const[talentData, setTalentData] = useState([])

    const handleTalentData = (data) => {
        setTalentData(data);
    }
    
    return(
        <div className="bg-gray-500 p-3 space-y-5">
            
            <h2 className="text-center text-white p-2">Taken from Immortal+ players and averaged them out</h2>
            <div className="flex">
                <div className="p-2 rounded-md"><AbilitiesContainer heroID={heroID} abilities={abilities} onData={handleTalentData} /></div>
                <div className="p-2 rounded-md"><TalentsContainer talents={talentData}/></div>
            </div>

            <div className="p-2 rounded-md text-center">
                <ItemsContainer items={items}/>
            </div>
        </div>
    )
}

export default BuildsInfo;