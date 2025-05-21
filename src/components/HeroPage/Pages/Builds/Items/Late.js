
import { useEffect, useState } from 'react'
import NthItem from './NthItem'

export default function Late({items, isCarry}) {

    const [m, setM] = useState(isCarry ? 4 : 3)
    const [lateItems, setLateItems] = useState(items)

    useEffect(() => {
        setM(isCarry ? 4 : 3)
        setLateItems(items)
    }, [items, isCarry])

    if(lateItems){

        return(
            <div className='bg-slate-900 rounded-lg border border-slate-800 space-y-1'>
                <div className='sm:flex items-end gap-2.5 px-5 pt-3'>
                    <h1 className='text-lg sm:text-xl font-bold'>Late Game Items</h1>
                    <h2 className='opacity-50'>Get these after your selected core items</h2>
                </div>
                <div className='grid grid-cols-2 lg:flex lg:justify-between w-full gap-2 p-3'>
                    {Array.from({ length: 6 }).map((_, index) => {
                        const entry = Object.entries(lateItems)[index];
                        const nth = entry?.[0] ?? index + m;
                        const nthItems = entry?.[1] ?? [];

                        return (
                            <div key={nth}>
                                <NthItem items={nthItems} order={nth.toString()} />
                            </div>
                        );
                    })}
                </div>

            </div>
        )
    }
    
}