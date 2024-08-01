import { useState, useEffect } from 'react'
import CoreItems from './CoreItems'

export default function Core({items, matches, isCarry}) {

    const [cores, setCores] = useState(() => {
        const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
        return temp
    })
    
    useEffect(() => {
        setCores(()=>{
            const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
            return temp
        })
    }, [items])

    return(
        <div className='rounded-lg border border-slate-800 space-y-3'>
            <div className='sm:flex items-end gap-2.5 px-5 pt-3'>
                <h1 className='text-lg sm:text-xl font-bold'>Core Items</h1>
                <h2 className='opacity-50'>First main items to purchase</h2>
            </div>
            <div className='bg-slate-900 px-5 py-3 space-y-2 rounded-b-lg'>
                <CoreItems core={cores[0]} matches={matches} isCarry={isCarry} />
                <div className='bg-slate-800 h-[2px] w-full' />
                <CoreItems core={cores[1]} matches={matches} isCarry={isCarry} />
                <div className='bg-slate-800 h-[2px] w-full' />
                <CoreItems core={cores[2]} matches={matches} isCarry={isCarry} />
            </div>
        </div>
    )
}