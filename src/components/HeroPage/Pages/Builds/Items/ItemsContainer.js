import { useState, useEffect } from 'react'

import Starting from './Starting'
import Boots from './Boots'
import Early from './Early'
import Core from './Core'
import Late from './Late'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Neutrals from './Neutrals'
import Ad from '../../../../../components/Ads/Venatus/Ad'


export default function ItemsContainer({build, hero, currRole}) {

    const router = useRouter()
    const initPath = router.asPath.split('/').pop()
    const initOptions = initPath.split("?")[1]


    const [isCarry, setIsCarry] = useState(currRole == "POSITION_4" || currRole == "POSITION_5" ? false : true)

    const [lateItems, setLateItems] = useState(build.core ? build.core[0].Late : [])

    const [currOptions, setCurrOptions] = useState('?' + initOptions)

    const handleLate = (data) => {
        setLateItems(data)
    }

    useEffect(() => {
        const initPath = router.asPath.split('/').pop()
        const initOptions = initPath.split("?")[1]
        setCurrOptions('?' + initOptions)
        if (currRole == "POSITION_4" || currRole == "POSITION_5") {
            setIsCarry(false)
        }
        else {
            setIsCarry(true)
        }
        if(build.core){
            setLateItems(build.core[0].Late)
        }
    }, [build, currRole, router])  

    return(
        <div className='w-full space-y-4'>
            <div className="sm:h-[200px] sm:flex lg:justify-between items-start sm:items-center lg:items-start gap-2.5 space-y-2 lg:space-y-0">
                <div className='px-12 lg:px-0 sm:w-[330px]'>
                    {build.starting ? <Starting items={build.starting} /> : <div>No starting data</div>}
                </div>
                <div className='flex lg:w-fill px-10 sm:px-0'>
                    {build.early ? <Early items={build.early} /> : <div>No early items data</div>}
                </div>
            </div>

            <div className='sm:w-1/3 sm:hidden px-10 sm:px-0'>
                {build.early ? <Early items={build.early} /> : <div>No early items data</div>}
            </div>

            <div className='w-full sm:w-3/5 sm:mx-auto lg:w-full bg-slate-950 rounded-xl'>
                {build.core ? <Core items={build.core} isCarry={isCarry} sendLate={handleLate} /> : <div>No core data</div>}    
                <div className="px-[13px]"><Late items={lateItems} isCarry={isCarry} /></div>
            </div>

            <div className='flex items-center px-3'>
                <div className='lg:flex lg:items-center gap-2 w-full sm:w-3/5 sm:mx-auto lg:mx-0 lg:w-3/4'>
                    {build.neutrals ? <Neutrals hero={hero} items={build.neutrals} /> : <div>No neutral data</div>}
                </div>
                <div className='hidden lg:block w-1/3'>
                    <Ad placementName="video" />
                </div>
            </div>
            
        </div>
    )
}