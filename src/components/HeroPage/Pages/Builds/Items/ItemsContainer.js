import { useState, useEffect } from 'react'

import Starting from './Starting'
import Boots from './Boots'
import Early from './Early'
import Core from './Core'
import Late from './Late'
import { useRouter } from 'next/router'
import Link from 'next/link'


export default function ItemsContainer({build, hero}) {

    const [isCarry, setIsCarry] = useState(true)
    console.log(hero)

    useEffect(() => {
        if (build.role == "POSITION_4" || build.role == "POSITION_5") {
            setIsCarry(false)
        }
        else {
            setIsCarry(true)
        }
    }, [build])
    

    return(
        <div className='w-full space-y-2'>
            <div className="h-72 sm:flex lg:justify-between items-start sm:items-center lg:items-start gap-2.5 space-y-2 lg:space-y-0">
                <div className='px-12 lg:px-0 space-y-4 sm:w-60'>
                    <Link href={`/hero/${hero.url}/items`} className='flex items-center justify-between mx-auto rounded-lg border border-cyan-200/25 px-5 py-2'>
                        <div>View More Items</div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link> 
                    <Starting items={build.starting} />
                </div>
                <div className='w-1/3 px-10 sm:px-0'><Early items={build.early} /></div>
                <div className={`w-5/12 sm:hidden lg:block`}>
                    <Core items={build.core} matches={build.total_matches} isCarry={isCarry} />
                </div>
            </div>
            <div className={`hidden sm:block lg:hidden w-1/2 mx-auto`}>
                    <Core items={build.core} matches={build.total_matches} isCarry={isCarry} />
                </div>
            <div className='w-full sm:w-3/4 sm:mx-auto lg:w-full '>
                <Late items={build} isCarry={isCarry} />
            </div>
        </div>
    )
}