import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'

import facets from '../../../../../json/hero_facets.json'

import Abilities from './Abilities/Abilities'
import Talents from './Abilities/Talents'
import Matchups from './Matchups/Matchups'
import ItemsContainer from './Items/ItemsContainer';
import IoLoading from '../../../IoLoading';
import Ad from '../../../../components/Ads/Venatus/Ad';


export default function Builds({ hero, heroData, currBuild, heroMatchups }) {

    const router = useRouter()

    const buttonClass = "p-4 gap-2 border-t border-l border-r border-slate-800 border-b-0 flex items-end justify-evenly"

    const iconLink = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/'

    const stratz_name = heroData.name.replace("npc_dota_hero_", "")
    const stratz_url = "https://www.stratz.com/heroes/" + heroData.hero_id + "-" + stratz_name.replace("_", "-")


    return(
        <div className='space-y-4 flex-col justify-center'>
            {currBuild ?
                <div className='lg:flex w-full gap-2 space-y-2 lg:space-y-0'>
                    <div className='sm:w-11/12 mx-auto lg:w-2/3 py-2 sm:py-3 px-3  bg-slate-900 rounded-lg border border-slate-800'><Abilities hero={heroData} abilities={currBuild.abilities} /></div>
                    <div className='sm:w-1/2 sm:mx-auto lg:w-1/3 py-2 sm:py-3 px-2 bg-slate-900 rounded-lg border border-slate-800'><Talents hero={heroData} talents={currBuild.talents} /></div>
                </div>
                :
                <div className='lg:flex w-full gap-2'>
                    <div className='lg:w-2/3 p-5 bg-slate-900 rounded-lg border border-slate-800'>Not enough Ability data</div>
                    <div className='lg:w-1/3 py-5 px-2 bg-slate-900 rounded-lg border border-slate-800'>Not enough Talent data</div>
                </div>
            }
            <div className='sm:hidden flex justify-center align-items-center'>
                <Ad placementName="video" />
            </div>
            {currBuild ?
                <div className='flex w-full gap-2'>
                    <ItemsContainer build={currBuild.items} hero={hero} role={currBuild.role} />
                </div>
                :
                <div>Not enough Item data</div>
            }
            {heroMatchups ? 
                <div className='sm:w-4/5 sm:mx-auto lg:w-full lg:flex lg:items-end px-5 py-2 gap-10 bg-slate-900 rounded-lg border border-slate-800 space-y-2 sm:space-y-0'>
                    <div className='lg:w-1/2'><Matchups type='against' matchups={heroMatchups[0].herovs} hero={heroData} /></div>
                    <div className='lg:w-1/2'><Matchups type='with' matchups={heroMatchups[0].herowith} hero={heroData} /></div>
                </div> : 
                <div className='w-full p-5 bg-slate-900 rounded-lg border border-slate-800 text-center text-lg'>
                    For {heroData.localized_name} matchups, visit <Link href={stratz_url} target="_blank" className='underline text-cyan-300 font-bold'>Stratz</Link>!
                </div>
            }
            
            {/* <Link href={`/hero/${hero.url}/matchups`} className='flex items-center justify-between mx-auto rounded-lg border border-cyan-200/25 px-5 py-3 w-48 hover:bg-slate-700'>
                <div>Open Matchups</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </Link> */}
           
        </div>
    )
}