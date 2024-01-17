import React, { useState } from 'react';

import AbilitiesContainer from './AbilitiesContainer';
import TalentsContainer from './TalentsContainer'

function BuildsInfo({hero}) {

    return(
        <div className="bg-gray-500 p-3">
            <div className="flex">
                <div className="p-2 border rounded-md"><AbilitiesContainer /></div>
                <div className="p-2 border rounded-md"><TalentsContainer /></div>
            </div>
        </div>
    )
}

export default BuildsInfo;