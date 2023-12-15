import React, { useState } from 'react';

import heroNames from '../../dotaconstants/build/hero_names.json';

function BuildsInfo({hero}) {

    const heroData = heroNames[hero]

    return(
        <div className="bg-gray-500 p-3">
            Builds
            <div className="flex">
                
            </div>
        </div>
    )
}

export default BuildsInfo;