import { useState, useEffect } from 'react'

import Starting from './Starting'
import Boots from './Boots'
import Early from './Early'
import Core from './Core'
import Late from './Late'


export default function ItemsContainer({build}) {


    console.log(build)

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
            <div className="flex justify-between items-start gap-2.5">
                <div className='h-full w-3/12'><Starting items={build.starting} /></div>
                <div className='w-4/12'><Early items={build.early} /></div>
                {/* <div className='w-1/2'><Boots items={build.boots} /></div> */}
                <div className={`${isCarry ? "w-5/12" : "w-4/12"}`}>
                    <Core items={build.core} matches={build.total_matches} isCarry={isCarry} />
                </div>
            </div>
            <div className='w-full'>
                <Late items={build} isCarry={isCarry} />
            </div>
        </div>
    )
}