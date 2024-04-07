import React, { useEffect, useState } from 'react';

import AbilitiesContainer from './AbilitiesContainer';
import TalentsContainer from './TalentsContainer';
import ItemsContainer from './ItemsContainer';

import heroes from '../../../../dotaconstants/build/heroes.json'


function BuildsInfo({heroID, role, builds, abilities}) {

    const heroName = heroes[heroID].name

    const items = builds[0].items

    const [currAbilities, setCurrAbilities] = useState([])
    const [currTalents, setCurrTalents] = useState([])

    useEffect(() => {
        let filteredAbilities = abilities.find(r => r.role === role && r.hero_id === heroID)
        setCurrAbilities(filteredAbilities.build)
        setCurrTalents(filteredAbilities.talents)
    }, [heroID, role, abilities])
    

    return(
        <div className="bg-gray-500 p-3 space-y-5 rounded-tr-md rounded-b-md">
            <div>
                <h1 className="text-center underline text-2xl text-white">BUILDS</h1>
            </div>
            <div className="flex justify-evenly">
                <div className="p-2 rounded-md"><AbilitiesContainer hero={heroName} abilities={currAbilities} /></div>
                <div className="p-2 rounded-md"><TalentsContainer hero={heroName} talents={currTalents} /></div>
            </div>

            <div className="p-2 rounded-md text-center">
                <ItemsContainer items={items} />
            </div>
        </div>
    )
}

export default BuildsInfo;