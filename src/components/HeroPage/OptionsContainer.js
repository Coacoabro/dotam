import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'

import Role from '../Role'
import Rank from '../Rank'
import Patches from '../Patches'
import Facets from '../Facets';

export default function OptionsContainer({ hero, initRole, initFacet, build}) {

    const router = useRouter()

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

            <div className='px-3 flex space-x-8 text-sm sm:text-lg justify-center sm:justify-start'>
                <Link href={`/hero/${hero.url}/builds`} className={`${router.pathname.includes('builds') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Builds</Link>
                <Link href={`/hero/${hero.url}/items`} className={`${router.pathname.includes('items') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Items</Link>
                <Link href={`/hero/${hero.url}/abilities`} className={`${router.pathname.includes('abilities') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Abilities</Link>
                <Link href={`/hero/${hero.url}/matchups`} className={`${router.pathname.includes('matchups') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Matchups</Link>
            </div>
            <div>
                {((build.total_wins / build.total_matches)*100).toLocaleString(0)}
            </div>
        </div>
    )
}