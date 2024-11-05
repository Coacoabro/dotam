import { useState, useEffect } from 'react'

import Starting from './Starting'
import Boots from './Boots'
import Early from './Early'
import Core from './Core'
import Late from './Late'
import Link from 'next/link'


export default function ItemsContainer({build, hero, role}) {

    const [isCarry, setIsCarry] = useState(role == "POSITION_4" || role == "POSITION_5" ? false : true)

    const [lateItems, setLateItems] = useState(build.core[0].late)

    const handleLate = (data) => {
        setLateItems(data)
    }

    useEffect(() => {
        if (role == "POSITION_4" || role == "POSITION_5") {
            setIsCarry(false)
        }
        else {
            setIsCarry(true)
        }
        setLateItems(build.core[0].late)
    }, [build, role])    

    return(
        <div className='w-full space-y-4 sm:space-y-2'>
            <div className="sm:h-72 sm:flex lg:justify-between items-start sm:items-center lg:items-start gap-2.5 space-y-2 lg:space-y-0">
                <div className='px-12 lg:px-0 space-y-4 sm:w-72'>
                    <Link href={`/hero/${hero.url}/items`} className='flex items-center justify-between mx-auto rounded-lg border border-cyan-200/25 px-5 py-2 hover:bg-slate-700'>
                        <div>View More Items</div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link> 
                    <Starting items={build.starting} />
                </div>
                <div className='hidden sm:flex lg:w-1/3 px-10 sm:px-0'>
                    <Early items={build.early} />
                </div>
                <div className={`hidden lg:w-2/5 lg:block`}>
                    <Core items={build.core} matches={build.total_matches} isCarry={isCarry} sendLate={handleLate} />
                </div>
            </div>
            <div className='sm:w-1/3 sm:hidden px-10 sm:px-0'>
                <Early items={build.early} />
            </div>
            <div className={`block lg:hidden sm:w-3/5 mx-auto`}>
                <Core items={build.core} matches={build.total_matches} isCarry={isCarry} sendLate={handleLate} />
            </div>
            <div className='w-full sm:w-3/5 sm:mx-auto lg:w-full'>
                <Late items={lateItems} isCarry={isCarry} />
            </div>
        </div>
    )
}