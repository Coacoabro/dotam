import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import json from '../../json/hero_facets.json'
import heroAbilities from '../../dotaconstants/build/hero_abilities.json'


export default function Facets( {name, id, initFacet, initRole, rates} ) {

    const router = useRouter()

    const { facet, role } = router.query

    const heroFacets = json[id]

    const [currFacet, setCurrFacet] = useState(facet || initFacet)
    const [currRole, setCurrRole] = useState(role || initRole)
    const [facetShow, setFacetShow] = useState(false)
    const [hoverFacet, setHoverFacet] = useState(null)
    const [hovFacetNum, setHovFacetNum] = useState(null)

    const iconLink = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/'

    const handleClick = (facet) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, facet }
        }, undefined, { scroll: false, shallow: true })
        setCurrFacet(facet)
    }

    const showFacetInfo = (facet, num) => {
        setFacetShow(true)
        setHoverFacet(facet)
        setHovFacetNum(num)
    }

    const hideFacetInfo = () =>{
        setFacetShow(false)
        setHoverFacet(null)
    }

    const facet1 = heroFacets[0]
    const facet2 = heroFacets[1]
    const facet3 = (() => {
        if (heroFacets.length > 2) {
          return heroFacets[2]
        }
        else{return null}
    })()
    const facet4 = (() => {
        if (heroFacets.length > 3) {
          return heroFacets[3]
        }
        else{return null}
    })()
    const facet5 = (() => {
        if (heroFacets.length > 4) {
          return heroFacets[4]
        }
        else{return null}
    })()   

    useEffect(() => {
        if(role){setCurrRole(role)}
    }, [role])


        
    return(
        <div>
            <div className="rounded-lg border border-slate-700 flex items-center h-8 sm:h-10">

                <button 
                    onClick={() => handleClick("1")} 
                    className={`flex py-2 px-2 sm:px-3 h-8 sm:h-10 ${initFacet == 1 ? 'w-16 sm:w-24' : 'w-8 sm:w-14'} space-x-2 justify-center hover:bg-slate-600 rounded-l-lg ${currFacet == 1 ? 'bg-cyan-300 text-black' : ''}  ${facet2 ? '' : 'rounded-r-lg'}`}
                    onMouseEnter={() => showFacetInfo(facet1, "1")}
                    onMouseLeave={() => hideFacetInfo()}
                >
                    {initFacet == 1 ? (<div className='underline font-bold'>Best</div>) : null}
                    <img src={iconLink + facet1.Icon + '.png'} className={`${currFacet == 1 ? 'brightness-0' : ''} w-4 h-4 sm:w-6 sm:h-6`} />
                </button>
                
                {facet2 ? (
                    <button 
                        onClick={() => handleClick("2")} 
                        className={`flex py-2 px-2 sm:px-3 h-8 sm:h-10 ${initFacet == 2 ? 'w-16 sm:w-24' : 'w-8 sm:w-14'} space-x-2 justify-center hover:bg-slate-600 ${currFacet == 2 ? 'bg-cyan-300 text-black' : ''} ${facet3 ? '' : 'rounded-r-lg'}`}
                        onMouseEnter={() => showFacetInfo(facet2, "2")}
                        onMouseLeave={() => hideFacetInfo()}
                    >
                        {initFacet == 2 ? (<div className='underline font-bold'>Best</div>) : null}
                        <img src={iconLink + facet2.Icon + '.png'} className={`${currFacet == 2 ? 'brightness-0' : ''} w-4 h-4 sm:w-6 sm:h-6`} />
                    </button>
                ) : null}

                {facet3 ? (
                    <button 
                        onClick={() => handleClick("3")}
                        className={`flex py-2 px-2 sm:px-3 h-8 sm:h-10 ${initFacet == 3 ? 'w-16 sm:w-24' : 'w-8 sm:w-14'} space-x-2 justify-center hover:bg-slate-600 ${currFacet == 3 ? 'bg-cyan-300 text-black' : ''}  ${facet4 ? '' : 'rounded-r-lg'} `}
                        onMouseEnter={() => showFacetInfo(facet3, "3")}
                        onMouseLeave={() => hideFacetInfo()}
                    >
                        {initFacet == 3 ? (<div className='underline font-bold'>Best</div>) : null}
                        <img src={iconLink + facet3.Icon + '.png'} className={`${currFacet == 3 ? 'brightness-0' : ''} w-4 h-4 sm:w-6 sm:h-6`} />
                    </button>
                ) : null}

                {facet4 ? (
                    <button 
                        onClick={() => handleClick("4")}
                        className={`flex py-2 px-2 sm:px-3 h-8 sm:h-10 ${initFacet == 4 ? 'w-16 sm:w-24' : 'w-8 sm:w-14'} space-x-2 justify-center hover:bg-slate-600 ${currFacet == 4 ? 'bg-cyan-300 text-black' : ''}  ${facet5 ? '' : 'rounded-r-lg'} `}
                        onMouseEnter={() => showFacetInfo(facet4, "4")}
                        onMouseLeave={() => hideFacetInfo()}
                    >
                        {initFacet == 4 ? (<div className='underline font-bold'>Best</div>) : null}
                        <img src={iconLink + facet4.Icon + '.png'} className={`${currFacet == 4 ? 'brightness-0' : ''} w-4 h-4 sm:w-6 sm:h-6`} />
                    </button>
                ) : null}

                {facet5 ? (
                    <button 
                        onClick={() => handleClick("5")}
                        className={`flex py-2 px-2 sm:px-3 h-8 sm:h-10 ${initFacet == 5 ? 'w-16 sm:w-24' : 'w-8 sm:w-14'} space-x-2 justify-center hover:bg-slate-600 rounded-r-lg ${currFacet == 5 ? 'bg-cyan-300 text-black' : ''} `}
                        onMouseEnter={() => showFacetInfo(facet5, "5")}
                        onMouseLeave={() => hideFacetInfo()}
                    >
                        {initFacet == 5 ? (<div className='underline font-bold'>Best</div>) : null}
                        <img src={iconLink + facet5.Icon + '.png'} className={`${currFacet == 5 ? 'brightness-0' : ''} w-4 h-4 sm:w-6 sm:h-6`} />
                    </button>
                ) : null}
                
            </div>

        {facetShow && rates &&
            <div className='hidden sm:block absolute py-2 z-50'>
                <div className="text-white border-slate-900 shadow whitespace-pre-line z-40 w-[300px] sm:w-[450px]">
                    <div className="text-lg sm:text-2xl flex font-bold rounded-t-lg p-2 justify-between sm:py-2 sm:px-5 bg-slate-800 border-slate-600 shadow border-t border-l border-r">
                        <div className='flex items-center gap-2'>
                            <img src={iconLink + hoverFacet.Icon + '.png'} className="w-6 h-8 sm:w-10 sm:h-10 rounded-md sm:p-1" />
                            {hoverFacet.Title}
                        </div>
                        <div className='flex flex-col  text-base font-medium text-right'>
                            <div>{((rates[currRole][hovFacetNum].total_wins / rates[currRole][hovFacetNum].total_matches)*100).toFixed(2)}% <span className='text-sm'>WR</span></div>
                            <span className='text-xs opacity-50'>{(rates[currRole][hovFacetNum].total_matches).toLocaleString()} Matches</span>
                        </div>
                    </div>
                    <p
                        className={`text-sm sm:text-lg px-3 py-2 sm:px-6 sm:py-5 bg-slate-950 text-cyan-300 border-l border-r border-b border-slate-600 rounded-b-lg`}
                        dangerouslySetInnerHTML={{
                            __html: hoverFacet.Desc.replace(/\{[^}]*\}/g, '?'),
                        }}
                    ></p>
                </div>
            </div>
        }

        </div>
    )
}