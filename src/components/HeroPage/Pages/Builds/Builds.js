import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'

import { globalPatch } from '../../../../../config';
import facets from '../../../../../json/hero_facets.json'

import Abilities from './Abilities/Abilities'
import Talents from './Abilities/Talents'
import Matchups from './Matchups/Matchups'
import ItemsContainer from './Items/ItemsContainer';
import IoLoading from '../../../IoLoading';

const fetchHeroData = async (hero, type) => {
    const response = await fetch(`/api/${hero}?type=${type}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
};

export default function Builds({ hero, initRole, initFacet, heroData, heroBuilds }) {

    const router = useRouter()

    const { role, rank, patch, facet } = router.query

    const buttonClass = "p-4 gap-2 border-t border-l border-r border-slate-800 border-b-0 flex items-end justify-evenly"

    const iconLink = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/'

    const [currBuild, setCurrBuild] = useState(heroBuilds.find((obj) => obj.role == initRole && obj.rank == "" && obj.facet == initFacet && obj.patch == globalPatch))

    useEffect(() => {

        const currRole = role || initRole
        const currRank = rank || ""
        const currPatch = patch || globalPatch
        const currFacet = facet || initFacet

        setCurrBuild(heroBuilds.find((obj) => obj.role == currRole && obj.rank == currRank && obj.patch == currPatch && obj.facet == currFacet))

    }, [role, rank, patch, facet, heroBuilds])

    return(
        <div className='space-y-4'>
            {currBuild ?
                <div className='lg:flex w-full gap-2 space-y-2 lg:space-y-0'>
                    <div className='sm:w-11/12 mx-auto lg:w-2/3 py-2 sm:py-5 px-3  bg-slate-900 rounded-lg border border-slate-800'><Abilities hero={heroData} abilities={currBuild.abilities} /></div>
                    <div className='sm:w-1/2 sm:mx-auto lg:w-1/3 py-2 sm:py-5 px-2 bg-slate-900 rounded-lg border border-slate-800'><Talents hero={heroData} talents={currBuild.talents} /></div>
                </div>
                :
                <div className='lg:flex w-full gap-2'>
                    <div className='lg:w-2/3 p-5 bg-slate-900 rounded-lg border border-slate-800'>Not enough Ability data</div>
                    <div className='lg:w-1/3 py-5 px-2 bg-slate-900 rounded-lg border border-slate-800'>Not enough Talent data</div>
                </div>
            }
            {currBuild ?
                <div className='flex w-full gap-2'>
                    <ItemsContainer build={currBuild} />
                </div>
                :
                <div>Not enough Item data</div>
            }
        </div>
    )
}