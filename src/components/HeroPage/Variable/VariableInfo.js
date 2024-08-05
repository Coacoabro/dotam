import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Patches from '../../Patches'
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

    const [facetShow, setFacetShow] = useState(false)
    const [hoverFacet, setHoverFacet] = useState(null)

    const showFacetInfo = (num) => {
        setFacetShow(true)
        setHoverFacet(num)
    }

    const hideFacetInfo = () =>{
        setFacetShow(false)
        setHoverFacet(null)
    }

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
                <div className='sm:hidden flex pb-4 items-center justify-evenly z-50'>
                    <Rank />
                    <Patches />
                </div>
                <div className='flex gap-8 items-end'>
                    <div className={`flex z-10 text-sm w-full lg:w-96`}>
                        <button 
                            className={`${buttonClass} ${currFacet == facet1 ? 'bg-slate-900' : 'bg-slate-900/50'} ${bestFacet == 1 ? 'w-3/5' : 'w-1/5'} rounded-tl-lg`} 
                            onClick={() => setFacetNum(1)} 
                            onMouseEnter={() => showFacetInfo(facet1)}
                            onMouseLeave={() => hideFacetInfo()}
                        >
                                {bestFacet == 1 ? <div className='font-bold text-base sm:text-lg lg:text-xl underline text-cyan-300'>Best Facet</div> : null}
                                <img src={iconLink + facet1.Icon + '.png'} className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:p-1" />
                                
                        </button>
                        <button 
                            className={`${buttonClass} ${currFacet == facet2 ? 'bg-slate-900' : 'bg-slate-900/50'} ${bestFacet == 2 ? 'w-3/5' : 'w-1/5'} ${facet3 ? '' : 'rounded-tr-lg'}`} 
                            onClick={() => setFacetNum(2)}
                            onMouseEnter={() => showFacetInfo(facet2)}
                            onMouseLeave={() => hideFacetInfo()}
                        >
                                {bestFacet == 2 ? <div className='font-bold text-base sm:text-lg lg:text-xl underline text-cyan-300'>Best Facet</div> : null}
                                <img src={iconLink + facet2.Icon + '.png'} className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:p-1" />
                        </button>
                        {facet3 ? (
                            <button 
                                className={`${buttonClass}  ${currFacet == facet3 ? 'bg-slate-900' : 'bg-slate-900/50'} ${bestFacet == 3 ? 'w-3/5' : 'w-1/5'} rounded-tr-lg`} 
                                onClick={() => setFacetNum(3)}
                                onMouseEnter={() => showFacetInfo(facet3)}
                                onMouseLeave={() => hideFacetInfo()}
                            >
                                {bestFacet == 3 ? <div className='font-bold text-base sm:text-lg lg:text-xl underline text-cyan-300'>Best Facet</div> : null}
                                <img src={iconLink + facet3.Icon + '.png'} className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:p-1" />
                            </button>
                        ) : null}
                    </div>
                    <div className='pb-4 hidden sm:block space-y-4'>
                        <RatesContainer rates={rates} initRole={initRole} />
                    </div>
                    
                </div>

                {facetShow &&
                    <div className='hidden sm:block absolute py-2 z-50'>
                        <div className="text-white border-slate-900 shadow whitespace-pre-line z-40 w-[300px] sm:w-[400px]">
                            <div className="text-lg sm:text-2xl flex font-bold rounded-t-lg py-2 px-3 sm:py-2 sm:px-5 bg-slate-800 items-center gap-2 border-slate-600 shadow border-t border-l border-r">
                            <img src={iconLink + hoverFacet.Icon + '.png'} className="w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:p-1" />
                                {hoverFacet.Title}
                            </div>
                            <p className={`text-sm sm:text-lg px-3 py-2 sm:px-6 sm:py-5 bg-slate-950 text-cyan-300 border-l border-r border-b border-slate-600 rounded-b-lg`}>
                                {hoverFacet.Desc.replace(/\{[^}]*\}/g, '?')}
                            </p>
                        </div>
                    </div>
                }

                <div className={`lg:flex lg:items-center lg:justify-between space-y-2 py-2 bg-slate-900 border border-slate-800 rounded-b-lg ${facet3 ? 'sm:rounded-tr-lg' : 'rounded-tr-lg'}`}>
                    
                     <div className='sm:hidden items-center justify-between text-slate-200 px-4 sm:px-10 py-2 sm:w-full space-y-2'>
                        <div className='sm:px-2 space-y-1 sm:w-3/5'>
                            <h1 className='text-slate-200 font-bold flex items-center gap-2.5 text-base'>
                                <img src={iconLink + currFacet.Icon + '.png'} className="w-5 h-5 sm:w-6 sm:h-6 rounded-md" />
                                {currFacet.Title}
                            </h1>
                            <h2 className='text-sm sm:text-base text-gray-300'>{currFacet.Desc.replace(/\{[^}]*\}/g, '?')}</h2>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <div className='flex items-center text-base sm:text-lg font-bold'>
                                {facetRates.find((obj) => obj.Facet == facetNum)?.WR}
                                <h1 className='font-medium'>% WR</h1>
                            </div>
                            <div className='text-xs sm:text-sm text-cyan-300'>({facetRates.find((obj) => obj.Facet == facetNum)?.Matches} Matches)</div>
                        </div>
                    </div>   
                    
                    <div className="sm:hidden w-full h-[1px] bg-slate-700/50" />

                    <div className='flex flex-col sm:flex-row items-center sm:px-12 py-1 gap-3'>
                        <Role initRole={initRole} />
                        <div className='h-12 w-[2px] bg-slate-700 hidden sm:block' />
                        <div className='hidden items-center sm:flex gap-2 z-0'>
                            <Rank />
                            <div className='h-12 w-[2px] bg-slate-700 hidden sm:block' />
                            <Patches />
                        </div>
                    </div>  

                    <div className='hidden sm:flex items-center gap-1.5 px-8'>
                        <div className='flex items-center text-base sm:text-lg font-bold'>
                            {facetRates.find((obj) => obj.Facet == facetNum)?.WR}
                            <h1 className='font-medium'>% WR</h1>
                        </div>
                        <div className='text-xs sm:text-sm text-cyan-300'>({facetRates.find((obj) => obj.Facet == facetNum)?.Matches} Matches)</div>
                    </div>
                                 
                     
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