import React, { useState } from 'react';

import AbilitiesContainer from './AbilitiesContainer';
import TalentsContainer from './TalentsContainer';
import ItemsContainer from './ItemsContainer';


function BuildsInfo({heroID, rank, role, builds}) {

    const items = builds[0].items
    console.log(items)

    return(
        <div className="bg-gray-500 p-3 space-y-5">
            <div className="flex">
                <div className="p-2 border rounded-md"><AbilitiesContainer heroID={heroID} rank={rank} role={role} /></div>
                <div className="p-2 border rounded-md"><TalentsContainer heroID={heroID} rank={rank} role={role} /></div>
            </div>

            <div className="p-2 border rounded-md text-center">
                <ItemsContainer items={items}/>
            </div>
        </div>
    )
}

export default BuildsInfo;