import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Rank from '../../Rank'
import Role from '../../Role'
import RatesContainer from './Rates/RatesContainer'
import Facet from './Facet'
import Abilities from './Abilities/Abilities'
import Talents from './Abilities/Talents'
import Matchups from './Matchups/Matchups'
import facets from '../../../../json/hero_facets.json'
import ItemsContainer from './Items/ItemsContainer';

export default function VariableInfo({ hero, rates, initRole, abilities, builds, matchups }) {

    const router = useRouter()

    const { role, rank } = router.query

    const [bestFacet, setBestFacet] = useState(() => {
        let most = 0
        let best = 0
        builds.forEach((obj) => {
            if(obj.role == initRole && obj.rank == ""){
                if(obj.total_matches > most){
                    most = obj.total_matches
                    best = obj.facet
                }
            }
        })
        return best
    })

    const [currAbilities, setCurrAbilities] = useState(abilities.find((obj) => obj.role == initRole))
    const [currMatchups, setCurrMatchups] = useState(matchups.filter((obj) => obj.role == initRole && obj.rank == ""))

    const buttonClass = "p-4 gap-2 border-t border-l border-r border-slate-800 border-b-0 flex items-end justify-evenly"

    const iconLink = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/'

    const heroFacets = facets[hero.hero_id]
    const facet1 = facets[hero.hero_id][0]
    const facet2 = facets[hero.hero_id][1]
    const facet3 = facets[hero.hero_id][2]    

    const [currFacet, setCurrFacet] = useState(heroFacets[bestFacet-1])
    const [currBuild, setCurrBuild] = useState(builds.find((obj) => obj.role == initRole && obj.rank == "" && obj.facet == bestFacet))
    const [facetNum, setFacetNum] = useState(bestFacet)
    const [facetRates, setFacetRates] = useState([])

    //CHANGE LATER WITH FACET UPDATE
    useEffect(() => {

        const currRole = role || initRole
        const currRank = rank || ""

        setCurrFacet(heroFacets[facetNum-1])

        setCurrBuild(builds.find((obj) => obj.role == currRole && obj.rank == currRank && obj.facet == facetNum))

        setCurrMatchups(matchups.filter((obj) => obj.role == currRole && (rank ? obj.rank.includes(rank) : obj.rank == "")))

        setBestFacet(() => {
                let most = 0
                let best = 0
                builds.forEach((obj) => {
                    if(obj.role == currRole && obj.rank == currRank){
                        if(obj.total_matches > most){
                            most = obj.total_matches
                            best = obj.facet
                        }
                    }
                })
                return best
            }
        )

        abilities.forEach((obj) => {
            if(obj.role == currRole) {
                setCurrAbilities(obj)
            }
        })

        setFacetRates(() => {
            rates = []
            builds.forEach((obj) => {
                if(obj.role == currRole && obj.rank == currRank){
                    if(obj.total_matches > 0){
                        rates.push({'Facet': obj.facet, 'Matches': obj.total_matches.toLocaleString(), 'WR': ((obj.total_wins/obj.total_matches)*100).toFixed(1)})
                    }
                }
            })
            return rates
        })

    }, [role, rank, abilities, matchups, builds, facetNum])
        
    return(
        <div className='mt-12 sm:mt-0 space-y-4'>
            <div>  
                <div className='pb-4 sm:hidden'>
                    <RatesContainer rates={rates} initRole={initRole} />
                </div>
                <div className='flex gap-8 items-end'>
                    <div className={`flex z-10 text-sm w-full lg:w-96`}>
                        <button className={`${buttonClass} ${currFacet == facet1 ? 'bg-slate-900' : 'bg-slate-900/50'} ${bestFacet == 1 ? 'w-3/5' : 'w-1/5'} rounded-tl-lg`} onClick={() => setFacetNum(1)}>
                                {bestFacet == 1 ? <div className='font-bold text-base underline text-cyan-300'>Best Facet</div> : null}
                                <img src={iconLink + facet1.Icon + '.png'} className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:p-1" />
                                
                        </button>
                        <button className={`${buttonClass} ${currFacet == facet2 ? 'bg-slate-900' : 'bg-slate-900/50'} ${bestFacet == 2 ? 'w-3/5' : 'w-1/5'} ${facet3 ? '' : 'rounded-tr-lg'}`} onClick={() => setFacetNum(2)}>
                                {bestFacet == 2 ? <div className='font-bold text-base underline text-cyan-300'>Best Facet</div> : null}
                                <img src={iconLink + facet2.Icon + '.png'} className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:p-1" />
                        </button>
                        {facet3 ? (
                            <button className={`${buttonClass}  ${currFacet == facet3 ? 'bg-slate-900' : 'bg-slate-900/50'} ${bestFacet == 3 ? 'w-3/5' : 'w-1/5'} rounded-tr-lg`} onClick={() => setFacetNum(3)}>
                                {bestFacet == 3 ? <div className='font-bold text-base underline text-cyan-300'>Best Facet</div> : null}
                                <img src={iconLink + facet3.Icon + '.png'} className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:p-1" />
                            </button>
                        ) : null}
                    </div>
                    <div className='pb-4 hidden sm:block'><RatesContainer rates={rates} initRole={initRole} /></div>
                </div>
                <div className={`sm:h-24 space-y-2 sm:flex items-center justify-between py-2 sm:py-6 px-5 bg-slate-900 border border-slate-800 rounded-b-lg ${facet3 ? 'sm:rounded-tr-lg' : 'rounded-tr-lg'}`}>
                    <div className='sm:flex items-center justify-between text-slate-200 px-2 py-2 space-y-2 sm:w-full'>
                        <div className='sm:px-2 space-y-1 sm:w-3/5'>
                            <h1 className='text-slate-200 font-bold flex items-center gap-2.5 text-xl sm:text-base'>
                                <img src={iconLink + currFacet.Icon + '.png'} className="w-6 h-6 sm:w-6 sm:h-6 rounded-md" />
                                {currFacet.Title}
                            </h1>
                            <h2 className='text-base text-gray-300'>{currFacet.Desc.replace(/\{[^}]*\}/g, '?')}</h2>
                        </div>
                        <div className='hidden lg:flex sm:h-16 w-[1px] bg-slate-600'/>
                        <div className='flex items-center gap-1.5 lg:w-1/3'>
                            <div className='flex items-center text-base sm:text-lg font-bold'>
                                {facetRates.find((obj) => obj.Facet == facetNum)?.WR}
                                <h1 className='font-medium'>% WR</h1>
                            </div>
                            <div className='text-xs sm:text-sm text-cyan-300'>({facetRates.find((obj) => obj.Facet == facetNum)?.Matches} Matches)</div>
                        </div>
                    </div>
                    <div className='hidden lg:block sm:h-16 w-[1px] bg-slate-600'/>
                    <div className='space-y-2 sm:space-y-0 hidden lg:flex gap-3 z-50 items-center sm:px-2'>
                        <div className='flex justify-center'><Role initRole={initRole} /></div>
                        <div className='hidden lg:block sm:h-16 w-[1px] bg-slate-600'/>
                        <div className='flex justify-center'><Rank /></div>
                    </div>
                </div>
                <div className='sm:flex lg:hidden items-center justify-evenly'>
                    <div className='lg:hidden flex justify-center py-2'><Role initRole={initRole} /></div>
                    <div className='lg:hidden flex justify-center py-1'><Rank initRole={initRole} /></div>
                </div>
                
            </div>
            {currBuild ?
                <div className='lg:flex w-full gap-2 space-y-2 lg:space-y-0'>
                    <div className='sm:w-11/12 mx-auto lg:w-2/3 py-2 sm:py-5 px-3  bg-slate-900 rounded-lg border border-slate-800'><Abilities hero={hero} abilities={currBuild.abilities} /></div>
                    <div className='sm:w-1/2 sm:mx-auto lg:w-1/3 py-2 sm:py-5 px-2 bg-slate-900 rounded-lg border border-slate-800'><Talents hero={hero} talents={currBuild.talents} /></div>
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
            {currMatchups[0] ? 
                <div className='sm:w-4/5 sm:mx-auto lg:w-full lg:flex lg:items-end px-5 py-2 lg:p-5 gap-10 bg-slate-900 rounded-lg border border-slate-800 space-y-2'>
                    <div className='lg:w-1/2'><Matchups type='against' matchups={currMatchups[0].herovs} hero={hero} /></div>
                    <div className='lg:w-1/2'><Matchups type='with' matchups={currMatchups[0].herowith} hero={hero} /></div>
                </div> : 
                <div className='w-full p-5 bg-slate-900 rounded-lg border border-slate-800'>
                    <h1 className='text-center text-slate-200'>No matchups available for this role</h1>
                </div>
            }
        </div>
    )
}