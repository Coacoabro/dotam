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

import abilitiesInfo from '../../../../../dotaconstants/build/abilities.json'
import heroAbilities from '../../../../../dotaconstants/build/hero_abilities.json'
import abilityIds from '../../../../../dotaconstants/build/ability_ids.json'


export default function Builds({ hero, heroData, currBuild, heroMatchups, currRole }) {

    const router = useRouter()

    const buttonClass = "p-4 gap-2 border-t border-l border-r border-slate-800 border-b-0 flex items-end justify-evenly"

    const iconLink = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/'

    const stratz_name = heroData.name.replace("npc_dota_hero_", "")
    const stratz_url = "https://www.stratz.com/heroes/" + heroData.hero_id + "-" + stratz_name.replace("_", "-") + "/matchups"

    const talents = currBuild.talents
    const talentsArray = []

    if (talents) {
        talents.forEach((talent) => {
            const tempTalent = abilityIds[talent.Talent]
            if(tempTalent) {
                if(abilitiesInfo[tempTalent]){
                    if(abilitiesInfo[tempTalent].dname){
                        talent.talent = abilitiesInfo[tempTalent].dname.replace(/\{[^}]*\}/g, '?')
                    }
                }
            }
        })
    }
    

    const talentOrder = heroAbilities[heroData.name].talents

    talentOrder.forEach((talent) => {
        if(abilitiesInfo[talent.name] && Object.keys(abilitiesInfo[talent.name]).length > 0)
            {
                talentsArray.push(abilitiesInfo[talent.name].dname.replace(/\{[^}]*\}/g, '?'))
            }
        else
            {
                talentsArray.push("?")
            }
    })

    const rightTalents = [talentsArray[6], talentsArray[4], talentsArray[2], talentsArray[0]]
    const leftTalents = [talentsArray[7], talentsArray[5], talentsArray[3], talentsArray[1]]

    const finishedTalents = [leftTalents, rightTalents]


    return(
        <div className='space-y-4 flex-col justify-center'>
            {currBuild ?
                <div className='lg:flex w-full gap-2 space-y-2 lg:space-y-0 h-[320px]'>
                    <div className='sm:w-11/12 mx-auto lg:w-[844px] py-2 sm:p-[17px]  bg-black-gradient rounded-xl border border-slate-800'><Abilities hero={heroData} abilities={currBuild.abilities} hero_talents={finishedTalents} /></div>
                    <div className='sm:w-1/2 sm:mx-auto lg:w-[500px] py-2 sm:py-2 px-2 bg-black-gradient rounded-xl border border-slate-800'><Talents hero={heroData} talents={currBuild.talents} hero_talents={finishedTalents} /></div>
                </div>
                :
                <div className='lg:flex w-full gap-2'>
                    <div className='lg:w-2/3 p-5 bg-black-gradient rounded-lg border border-slate-800'>Not enough Ability data</div>
                    <div className='lg:w-1/3 py-5 px-2 bg-black-gradient rounded-lg border border-slate-800'>Not enough Talent data</div>
                </div>
            }
            <div className='sm:hidden flex justify-center align-items-center'>
                <Ad placementName="video" />
            </div>
            {currBuild ?
                <div className='flex w-full gap-2'>
                    <ItemsContainer build={currBuild.items} hero={hero} currRole={currRole} />
                </div>
                :
                <div>Not enough Item data</div>
            }           
        </div>
    )
}