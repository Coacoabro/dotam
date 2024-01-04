import React, { useState } from 'react';

import heroNames from '../../dotaconstants/build/hero_names.json';
import AbilitiesContainer from './Builds/AbilitiesContainer';

function BuildsInfo({hero}) {

    const heroData = heroNames[hero]

    return(
        <div className="bg-gray-500 p-3">
            <div className="flex">
                <AbilitiesContainer hero={hero}/>
            </div>
        </div>
    )
}

export default BuildsInfo;