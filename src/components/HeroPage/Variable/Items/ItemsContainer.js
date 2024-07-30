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
            <div className="sm:flex justify-between items-start gap-2.5 space-y-2 sm:space-y-0">
                <div className='h-full sm:w-3/12 px-8 sm:px-0'><Starting items={build.starting} /></div>
                <div className='px-8 sm:px-0 sm:w-4/12'><Early items={build.early} /></div>
                {/* <div className='sm:w-1/2'><Boots items={build.boots} /></div> */}
                <div className={`${isCarry ? "sm:w-5/12" : "sm:w-4/12"}`}>
                    <Core items={build.core} matches={build.total_matches} isCarry={isCarry} />
                </div>
            </div>
            <div className='w-full px-10 sm:px-0'>
                <Late items={build} isCarry={isCarry} />
            </div>
        </div>
    )
}