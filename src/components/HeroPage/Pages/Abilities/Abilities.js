import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

import { globalPatch } from '../../../../../config'

import AbilityPath from "./AbilityPath/AbilityPath";
import TalentOptions from "./TalentOption/TalentOptions";

export default function Abilities({ initRole, initFacet, heroData, heroBuilds }) {

    const router = useRouter()
    const { role, rank, patch, facet } = router.query

    const [currBuild, setCurrBuild] = useState(heroBuilds.find((obj) => obj.role == initRole && obj.rank == "" && obj.facet == initFacet && obj.patch == globalPatch))

    useEffect(() => {

        const currRole = role || initRole
        const currRank = rank || ""
        const currPatch = patch || globalPatch
        const currFacet = facet || initFacet

        setCurrBuild(heroBuilds.find((obj) => obj.role == currRole && obj.rank == currRank && obj.patch == currPatch && obj.facet == currFacet))

    }, [role, rank, patch, facet, heroBuilds])

    console.log(currBuild)
    
    return(
        <div className="space-y-4">
            <AbilityPath abilities={currBuild.abilities} />
            <TalentOptions talents={currBuild.talents} />
        </div>
    )

}