import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'

import Role from '../../Role'
import Rank from '../../Rank'
import Patches from '../../Patches'
import Facets from '../../Facets';

export default function OptionsContainer({ hero, initRole, initFacet, heroBuilds, buildFinder, current_patch}) {

    const router = useRouter()

    const {role, rank, patch, facet} = router.query

    const [currBuild, setCurrBuild] = useState('')

    useEffect(() => {

        const currRole = role || initRole
        const currRank = rank || ""
        const currPatch = patch || current_patch
        const currFacet = facet || initFacet
        
        if(heroBuilds){
            setCurrBuild(heroBuilds.find((obj) => obj.role == currRole && obj.rank == currRank && obj.patch == currPatch && obj.facet == currFacet))
        }
        
    }, [role, rank, facet, patch, heroBuilds])

    console.log(currBuild)

    return (
        <div className='pb-3 sm:py-3 space-y-2 bg-slate-900 rounded-lg border border-slate-800 text-xs'>

            {/* Desktop Screen */}
            <div className='px-3 gap-2 text-lg items-center hidden sm:flex'>
                <div>Facets: </div>
                <Facets initFacet={initFacet} id={hero.id} />
                <div className='h-9 w-[1px] bg-slate-600'/>
                <div>Roles: </div>
                <Role initRole={initRole} />
                <div className='h-9 w-[1px] bg-slate-600'/>
                <div>Ranks: </div>
                <Rank />
                <div className='h-9 w-[1px] bg-slate-600'/>
                <div>Patch: </div>
                <Patches />
            </div>


            {/* Mobile Screen */}
            <div className='sm:hidden flex justify-evenly items-center'>
                <Facets initFacet={initFacet} id={hero.id} />
                <Rank />
                <Patches />
            </div>

            <div className='w-full bg-slate-600/50 h-[1px] sm:hidden'/>

            <div className='mx-auto sm:hidden flex justify-center'>
                <Role initRole={initRole} />
            </div>

            {/* Both Mobile and Desktop */}
            <div className='w-full bg-slate-600/50 h-[1px]'/>

            <div className='px-3 flex sm:hidden space-x-8 text-sm justify-center'>
                <Link href={`/hero/${hero.url}/builds`} className={`${router.pathname.includes('builds') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Builds</Link>
                <Link href={`/hero/${hero.url}/items`} className={`${router.pathname.includes('items') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Items</Link>
                <Link href={`/hero/${hero.url}/abilities`} className={`${router.pathname.includes('abilities') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Abilities</Link>
                <Link href={`/hero/${hero.url}/matchups`} className={`${router.pathname.includes('matchups') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Matchups</Link>
            </div>

            <div className='hidden sm:flex justify-between'>
                <div className='px-3 flex space-x-8 text-sm sm:text-lg justify-center sm:justify-start'>
                    <Link href={`/hero/${hero.url}/builds`} className={`${router.pathname.includes('builds') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Builds</Link>
                    <Link href={`/hero/${hero.url}/items`} className={`${router.pathname.includes('items') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Items</Link>
                    <Link href={`/hero/${hero.url}/abilities`} className={`${router.pathname.includes('abilities') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Abilities</Link>
                    <Link href={`/hero/${hero.url}/matchups`} className={`${router.pathname.includes('matchups') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Matchups</Link>
                </div>
                {currBuild &&
                    <div className='px-3 text-lg text-right flex gap-1 items-center'>
                        <div className='font-bold'>{((currBuild.total_wins / currBuild.total_matches)*100).toFixed(2)}% WR</div>
                        <div className='text-sm text-cyan-300'>({currBuild.total_matches.toLocaleString()} Matches)</div>
                    </div>
                }
            </div>
        </div>
    )
}