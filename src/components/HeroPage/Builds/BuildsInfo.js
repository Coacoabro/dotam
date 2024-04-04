import React, { useState } from 'react';

import AbilitiesContainer from './AbilitiesContainer';
import TalentsContainer from './TalentsContainer';
import ItemsContainer from './ItemsContainer';

import heroes from '../../../../dotaconstants/build/heroes.json'


function BuildsInfo({heroID, builds, abilities}) {

    const items = builds[0].items

    const talentData = abilities.talents

    const heroName = heroes[heroID].name

    
    return(
        <div className="bg-gray-500 p-3 space-y-5 rounded-md">
            <div>
                <h1 className="text-center underline text-2xl text-white">BUILDS</h1>
                <h2 className="text-center text-white p-2">Taken from Immortal+ players and averaged them out</h2>
            </div>
            <div className="flex">
                <div className="p-2 rounded-md"><AbilitiesContainer hero={heroName} abilities={abilities} /></div>
                <div className="p-2 rounded-md"><TalentsContainer hero={heroName} talents={talentData}/></div>
            </div>

            <div className="p-2 rounded-md text-center">
                <ItemsContainer items={items}/>
            </div>
        </div>
    )
}

export default BuildsInfo;