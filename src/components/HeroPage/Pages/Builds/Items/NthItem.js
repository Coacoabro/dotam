import {useState, useEffect} from 'react'
import ItemCard from './ItemCard'

export default function NthItem({order, items}){

    const late_items = items ? items.slice(0, 3) : null

    if (late_items){

        return(
            <div className='rounded-lg border border-slate-800 bg-slate-950 w-40 sm:w-48'>
                <div className='font-medium text-center py-1 text-lg'>{order}{order == 3 ? "RD" : "TH"}</div>
                <div className='w-full h-[1px] bg-slate-800' />
                <div className='bg-slate-800 py-3 space-y-2 px-2 rounded-b-lg items-center whitespace-nowrap truncate'>
                    {late_items.map((item, index) => (
                        <ItemCard item={item} index={index} />
                    ))}
                </div>
            </div>
        )
    }
    else {
        return(
            <div className='rounded-lg border border-slate-800 bg-slate-950 w-40 sm:w-48'>
                <div className='font-medium text-center py-1 text-lg'>
                    {order}{order == 3 ? "RD" : "TH"}
                </div>
            </div>
        )
    }
}