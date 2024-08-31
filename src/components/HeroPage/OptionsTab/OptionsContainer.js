import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'

import Role from '../../Role'
import Rank from '../../Rank'
import Patches from '../../Patches'
import Facets from '../../Facets';

export default function OptionsContainer({ hero, initRole}) {

    const router = useRouter()

    return (
        <div className='py-3 space-y-2 bg-slate-900 rounded-lg border border-slate-800'>
            <div className='px-3 flex gap-2 text-lg items-center'>
                <div>Facets: </div>
                <Facets />
                <div className='h-9 w-[2px] bg-slate-600'/>
                <div>Roles: </div>
                <Role initRole={initRole} />
                <div className='h-9 w-[2px] bg-slate-600'/>
                <div>Ranks: </div>
                <Rank />
                <div className='h-9 w-[2px] bg-slate-600'/>
                <div>Patch: </div>
                <Patches />
            </div>
            <div className='w-full bg-slate-600/50 h-[1px]'/>
            <div className='px-3 flex space-x-8 text-lg'>
                <Link href={`/hero/${hero.url}/builds`} className={`${router.pathname.includes('builds') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Builds</Link>
                <Link href={`/hero/${hero.url}/items`} className={`${router.pathname.includes('items') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Items</Link>
                <Link href={`/hero/${hero.url}/abilities`} className={`${router.pathname.includes('abilities') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Abilities</Link>
                <Link href={`/hero/${hero.url}/matchups`} className={`${router.pathname.includes('matchups') ? 'text-indigo-300 underline font-bold' : ''} hover:underline`}>Matchups</Link>
            </div>
        </div>
    )
}