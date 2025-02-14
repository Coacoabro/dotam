import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

import AbilityPath from "./AbilityPath/AbilityPath";
import TalentOptions from "./TalentOption/TalentOptions";
import AbilitiesContainer from './AbilityPath/AbilitiesContainer';
import Ad from '../../../../components/Ads/Venatus/Ad';

export default function Abilities({ initRole, initFacet, heroData, heroBuilds, current_patch }) {

    const router = useRouter()
    const { role, rank, patch, facet } = router.query

    const [currBuild, setCurrBuild] = useState(heroBuilds.find((obj) => obj.role == initRole && obj.rank == "" && obj.facet == initFacet && obj.patch == current_patch))

    useEffect(() => {

        const currRole = role || initRole
        const currRank = rank || ""
        const currPatch = patch || current_patch
        const currFacet = facet || initFacet

        setCurrBuild(heroBuilds.find((obj) => obj.role == currRole && obj.rank == currRank && obj.patch == currPatch && obj.facet == currFacet))

    }, [role, rank, patch, facet, heroBuilds])

    if(currBuild){
        return(
            <div className="space-y-4">
                <TalentOptions talents={currBuild.talents} hero={heroData} />
                <div className='sm:hidden flex justify-center align-items-center'>
                    <Ad placementName="mobile_takeover" />
                </div>
                <AbilitiesContainer abilities={currBuild.abilities} hero={heroData} />
            </div>
        )
    }

}