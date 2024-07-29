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

    const buttonClass = "space-y-2 rounded-t-lg p-2 gap-2 border-t border-l border-r border-slate-800 border-b-0"

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
        <div className='mt-10 sm:mt-0 space-y-4'>
            <div>  
                <div className='pb-4 sm:hidden'><RatesContainer rates={rates} initRole={initRole} /></div>
                <div className='flex gap-2 items-end'>
                    <div className={`${facet3 ? 'w-[400px]' : 'w-80'} flex z-10 text-sm gap-2`}>
                        <div>
                            <button 
                                className={`${buttonClass} ${currFacet == facet1 ? 'bg-slate-900' : 'bg-slate-950'}`}
                                onClick={() => setFacetNum(1)}
                            >
                                <div className='flex items-end text-slate-300 gap-2'>
                                    <img src={iconLink + facet1.Icon + '.png'} className="w-8 h-8 rounded-md" />
                                    <div className='flex items-end text-lg gap-1'>
                                        <p className='font-bold'>{facetRates.find((obj) => obj.Facet == 1)?.WR}%</p>
                                        <p className='text-sm opacity-75'>WR</p>
                                    </div>
                                </div>
                                <div className='text-slate-300 text-xs'>({facetRates.find((obj) => obj.Facet == 1)?.Matches} Matches)</div>
                            </button>
                        </div>
                        <div>
                            <button 
                                className={`${buttonClass} ${currFacet == facet2 ? 'bg-slate-900' : 'bg-slate-950'}`}
                                onClick={() => setFacetNum(2)}
                            >
                                <div className='flex items-end text-slate-300 gap-2'>
                                    <img src={iconLink + facet2.Icon + '.png'} className="w-8 h-8 rounded-md" />
                                    <div className='flex items-end text-lg gap-1'>
                                        <p className='font-bold'>{facetRates.find((obj) => obj.Facet == 2)?.WR}%</p>
                                        <p className='text-sm opacity-75'>WR</p>
                                    </div>
                                </div>
                                <div className='text-slate-300 text-xs'>({facetRates.find((obj) => obj.Facet == 2)?.Matches} Matches)</div>
                            </button>
                        </div>
                        {facet3 ? (
                            <div>
                                <button 
                                    className={`${buttonClass}`}
                                    onClick={() => setFacetNum(3)}
                                >
                                    <div className='flex items-end text-slate-300 gap-2'>
                                        <img src={iconLink + facet3.Icon + '.png'} className="w-8 h-8 rounded-md" />
                                        <div className='flex items-end text-lg gap-1'>
                                            <p className='font-bold'>{facetRates.find((obj) => obj.Facet == 3)?.WR}%</p>
                                            <p className='text-sm opacity-75'>WR</p>
                                        </div>
                                    </div>
                                    <div className='text-slate-300 text-xs'>({facetRates.find((obj) => obj.Facet == 3)?.Matches} Matches)</div>
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <div className='pb-4 hidden sm:block'><RatesContainer rates={rates} initRole={initRole} /></div>
                    {}
                </div>
                <div className='flex items-center justify-between py-6 px-5 bg-slate-900 border border-slate-800 rounded-b-lg rounded-tr-lg'>
                    <div className='text-slate-400 gap-2'>
                        <h1 className='text-slate-200 font-bold flex items-center gap-1'>
                            <img src={iconLink + currFacet.Icon + '.png'} className="w-6 h-6 rounded-md" />
                            {currFacet.Title}
                        </h1>
                        <h2 className='text-sm'>{currFacet.Desc.replace(/\{[^}]*\}/g, '?')}</h2>
                    </div>
                    <div className='flex gap-3 z-50 items-center'>
                        <Role initRole={initRole} />
                        <div className='h-10 w-[1px] bg-slate-600'/>
                        <Rank />
                    </div>
                </div>
            </div>
            {currBuild ?
                <div className='flex w-full gap-2'>
                    <div className='w-2/3 p-5 bg-slate-900 rounded-lg border border-slate-800'><Abilities hero={hero} abilities={currBuild.abilities} /></div>
                    <div className='w-1/3 py-5 px-2 bg-slate-900 rounded-lg border border-slate-800'><Talents hero={hero} talents={currBuild.talents} /></div>
                </div>
                :
                <div className='flex w-full gap-2'>
                    <div className='w-2/3 p-5 bg-slate-900 rounded-lg border border-slate-800'>Not enough Ability data</div>
                    <div className='w-1/3 py-5 px-2 bg-slate-900 rounded-lg border border-slate-800'>Not enough Talent data</div>
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
                <div className='w-full flex p-5 gap-10 bg-slate-900 rounded-lg border border-slate-800'>
                    <div className='w-1/2'><Matchups type='against' matchups={currMatchups[0].herovs} hero={hero} /></div>
                    <div className='w-1/2'><Matchups type='with' matchups={currMatchups[0].herowith} hero={hero} /></div>
                </div> : 
                <div className='w-full p-5 bg-slate-900 rounded-lg border border-slate-800'>
                    <h1 className='text-center text-slate-200'>No matchups available for this role</h1>
                </div>
            }
        </div>
    )
}