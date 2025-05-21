
import { useEffect, useState } from 'react'
import NthItem from './NthItem'

export default function Late({items, isCarry}) {

    const [m, setM] = useState(isCarry ? 4 : 3)

    useEffect(() => {
        setM(isCarry ? 4 : 3)
    }, [isCarry])

    return(
        <div className='bg-slate-900 rounded-lg border border-slate-800 space-y-1'>
            <div className='sm:flex items-end gap-2.5 px-5 pt-3'>
                <h1 className='text-lg sm:text-xl font-bold'>Late Game Items</h1>
                <h2 className='opacity-50'>Get these after your selected core items</h2>
            </div>
            <div className='grid grid-cols-2 lg:flex lg:justify-between w-full gap-2 p-3'>
                <div className='sm:w-4/5 lg:w-48'><NthItem order={m.toString()} items={items[m.toString()]} /></div>
                <div className='sm:w-4/5 lg:w-48'><NthItem order={(m+1).toString()} items={items[(m+1).toString()]} /></div>
                <div className='sm:w-4/5 lg:w-48'><NthItem order={(m+2).toString()} items={items[(m+2).toString()]} /></div>
                <div className='sm:w-4/5 lg:w-48'><NthItem order={(m+3).toString()} items={items[(m+3).toString()]} /></div>
                <div className='sm:w-4/5 lg:w-48'><NthItem order={(m+4).toString()} items={items[(m+4).toString()]} /></div>
                <div className='sm:w-4/5 lg:w-48'><NthItem order={(m+5).toString()} items={items[(m+5).toString()]} /></div>
            </div>
        </div>
    )
    
}