import React, { useEffect, useState } from 'react';

import AbilitiesContainer from './AbilitiesContainer';
import TalentsContainer from './TalentsContainer';
import ItemsContainer from './ItemsContainer';

import heroes from '../../../../dotaconstants/build/heroes.json'


function BuildsInfo({heroID, builds, abilities, talents, items}) {

    const heroName = heroes[heroID].name

    return(
        <div className="bg-gray-500 p-3 space-y-5 rounded-tr-md rounded-b-md">
            <div className="md:flex justify-evenly items-center">
                <div className="p-2 rounded-md"><AbilitiesContainer hero={heroName} abilities={abilities} /></div>
                <div className="p-2 rounded-md"><TalentsContainer hero={heroName} talents={talents} /></div>
            </div>

            <div className="p-2 rounded-md text-center">
                <ItemsContainer builds={builds} items={items} />
            </div>
        </div>
    )
}

export default BuildsInfo;