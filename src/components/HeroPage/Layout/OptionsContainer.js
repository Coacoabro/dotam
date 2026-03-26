import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'

import Role from '../../Role'
import Rank from '../../Rank'
import Patches from '../../Patches'
import Facets from '../../Facets';
import Pages from '../../Pages';


export default function OptionsContainer({ hero, initRole, initFacet, hero_name, summary }) {

    const router = useRouter()

    const hero_id = hero.id

    return (
        <div className='pb-3 sm:py-3 lg:py-0 space-y-2 bg-slate-900 rounded-lg border border-slate-800 text-xs'>

            {/* Desktop Screen */}
            <div className='px-3 text-lg items-center hidden lg:flex justify-evenly'>
                {initFacet == 'blank' ? null : 
                <>
                    <div className='flex gap-2 items-center'>
                        Facets: 
                        <Facets initFacet={initFacet} initRole={initRole} name={hero_name} id={hero_id} rates={summary} />
                    </div>
                
                    <div className='h-14 w-[1px] bg-slate-800'/>
                </>
                }
                <div className='flex gap-2 items-center'>
                    Roles: 
                    <Role initRole={initRole} />
                </div>
                <div className='h-14 w-[1px] bg-slate-800'/>
                <div className='flex gap-2 items-center'>
                    Ranks: 
                    <Rank />
                </div>
                <div className='h-14 w-[1px] bg-slate-800'/>
                <div className='flex gap-2 items-center'>
                    Patch: 
                    <Patches />
                </div>
            </div>


            {/* Mobile Screen */}
            <div className='lg:hidden flex justify-evenly items-center'>
                {initFacet == 'blank' ? null : 
                    <Facets initFacet={initFacet} initRole={initRole} name={hero_name} id={hero_id} rates={summary} />
                }
                <Rank />
                <Patches />
            </div>

            <div className='w-full bg-slate-600/50 h-[1px] lg:hidden'/>

            <div className='mx-auto lg:hidden flex justify-center'>
                <Role initRole={initRole} />
            </div>

            {/* Both Mobile and Desktop */}
            <div className='lg:hidden w-full bg-slate-600/50 h-[1px]'/>

            <div className='px-3 flex lg:hidden space-x-8 text-sm md:text-lg justify-center'>
                <Link href={`/hero/${hero.url}/builds`} className={`${router.asPath.includes('builds') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Builds</Link>
                <Link href={`/hero/${hero.url}/items`} className={`${router.asPath.includes('items') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Items</Link>
                <Link href={`/hero/${hero.url}/abilities`} className={`${router.asPath.includes('abilities') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Abilities</Link>
                {/* <Link href={`/hero/${hero.url}/matchups`} className={`${router.asPath.includes('matchups') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Matchups</Link> */}
            </div>

            {/* <div className='hidden sm:flex justify-between'>
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
            </div> */}
        </div>
    )
}