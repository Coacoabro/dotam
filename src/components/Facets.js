import { useState } from 'react'
import { useRouter } from 'next/router';
import json from '../../json/hero_facets.json'


export default function Facets( {id, initFacet} ) {

    const router = useRouter()

    const { facet } = router.query

    const [currFacet, setCurrFacet] = useState(facet || initFacet || "")

    const iconLink = 'https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/facets/'

    const handleClick = (facet) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, facet }
        })
        setCurrFacet(facet)
    }

    const facet1 = json[id][0]
    const facet2 = json[id][1]
    const facet3 = (() => {
        if (json[id].length > 2) {
          return json[id][2]
        }
        else{return null}
    })()    

    return(
        <div className="rounded-lg border border-slate-700 flex">

            <button 
                onClick={() => handleClick("1")} 
                className={`flex px-3 py-2 h-10 ${initFacet == 1 ? 'w-24' : 'w-14'} space-x-2 justify-center hover:bg-slate-600 rounded-l-lg ${currFacet == 1 ? 'bg-cyan-300 text-black' : ''} `}
            >
                {initFacet == 1 ? (<div className='underline font-bold'>Best</div>) : null}
                <img src={iconLink + facet1.Icon + '.png'} className={`${currFacet == 1 ? 'brightness-0' : ''}`} />
            </button>

            <div className='bg-slate-600 w-[1px] h-10' />
            
            <button 
                onClick={() => handleClick("2")} 
                className={`flex px-3 py-2 h-10 ${initFacet == 2 ? 'w-24' : 'w-14'} space-x-2 justify-center hover:bg-slate-600 ${currFacet == 2 ? 'bg-cyan-300 text-black' : ''} ${facet3 ? '' : 'rounded-r-lg'}`}
            >
                {initFacet == 2 ? (<div className='underline font-bold'>Best</div>) : null}
                <img src={iconLink + facet2.Icon + '.png'} className={`${currFacet == 2 ? 'brightness-0' : ''}`} />
            </button>

            {facet3 ? (
                <button 
                    onClick={() => handleClick("3")}
                    className={`flex px-3 py-2 h-10 ${initFacet == 3 ? '' : 'w-14'} space-x-2 justify-center hover:bg-slate-600 rounded-r-lg ${currFacet == 3 ? 'bg-cyan-300 text-black' : ''} `}
                >
                    {initFacet == 3 ? (<div className='underline font-bold'>Best</div>) : null}
                    <img src={iconLink + facet3.Icon + '.png'} className={`${currFacet == 3 ? 'brightness-0' : ''}`} />
                </button>
            ) : null}
        </div>
    )
}