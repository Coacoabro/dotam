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

    console.log(facet1, facet2, facet3)
    

    return(
        <div className="rounded-lg border border-slate-700 flex">

            <button>
                <img src={iconLink + facet1.Icon + '.png'} className='px-2 py-1 w-10 hover:bg-slate-700 rounded-l-lg'/>
            </button>

            <div className='bg-slate-600 w-[1px] h-8' />
            
            <button>
                <img src={iconLink + facet2.Icon + '.png'} className={`px-2 py-1 w-10 hover:bg-slate-700 ${facet3 ? '' : 'rounded-r-lg'}`}/>
            </button>

            {facet3 ? (
                <button>
                    <img src={iconLink + facet3.Icon + '.png'} className='px-2 py-1 w-10 hover:bg-slate-700 rounded-r-lg'/>
                </button>
            ) : null}
        </div>
    )
}