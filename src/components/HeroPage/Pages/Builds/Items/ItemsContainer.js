import { useState, useEffect } from 'react'

import Starting from './Starting'
import Boots from './Boots'
import Early from './Early'
import Core from './Core'
import Late from './Late'


export default function ItemsContainer({build}) {

    const [isCarry, setIsCarry] = useState(true)

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
            <div className="sm:flex sm:justify-evenly lg:justify-between items-start sm:items-center lg:items-start gap-2.5 space-y-2 lg:space-y-0">
                <div className='h-full lg:w-3/12 px-12 lg:px-0'><Starting items={build.starting} /></div>
                <div className='px-10 sm:px-0 lg:w-4/12'><Early items={build.early} /></div>
                <div className={`${isCarry ? "lg:w-5/12" : "lg:w-4/12"} sm:hidden lg:block`}>
                    <Core items={build.core} matches={build.total_matches} isCarry={isCarry} />
                </div>
            </div>
            <div className={`${isCarry ? "lg:w-5/12" : "lg:w-4/12"} hidden sm:block lg:hidden w-1/2 mx-auto`}>
                    <Core items={build.core} matches={build.total_matches} isCarry={isCarry} />
                </div>
            <div className='w-full sm:w-3/4 sm:mx-auto lg:w-full '>
                <Late items={build} isCarry={isCarry} />
            </div>
        </div>
    )
}