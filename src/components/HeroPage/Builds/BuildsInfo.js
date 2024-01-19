import React, { useState } from 'react';

import AbilitiesContainer from './AbilitiesContainer';
import TalentsContainer from './TalentsContainer'

function BuildsInfo({heroID, rank, role}) {
    return(
        <div className="bg-gray-500 p-3">
            <div className="flex">
                <div className="p-2 border rounded-md"><AbilitiesContainer heroID={heroID} rank={rank} role={role} /></div>
                <div className="p-2 border rounded-md"><TalentsContainer heroID={heroID} rank={rank} role={role} /></div>
            </div>
        </div>
    )
}

export default BuildsInfo;