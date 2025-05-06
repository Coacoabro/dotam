import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

import AbilityPath from "./AbilityPath/AbilityPath";
import TalentOptions from "./TalentOption/TalentOptions";
import AbilitiesContainer from './AbilityPath/AbilitiesContainer';
import Ad from '../../../../components/Ads/Venatus/Ad';

export default function Abilities({ heroData, currBuild }) {

    const router = useRouter()
    const { role, rank, patch, facet } = router.query

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