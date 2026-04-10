import {useState, useEffect} from 'react'
import ItemCard from './ItemCard'

export default function NthItem({order, items}){

    const late_items = items ? items.slice(0, 3) : null

    

    return(
        <div className='rounded-lg border border-slate-900 w-40 sm:w-[205px]'>
            <div className='font-medium text-center py-1.5 text-[16px]/[24px] text-white/[64%]'>{order}{order == 3 ? "RD" : "TH"}</div>
            <div className='w-full h-[1px] bg-slate-900' />
            {late_items && (
                <div className='bg-[#0B0D1CCC] py-3 space-y-2 px-2 rounded-b-lg items-center whitespace-nowrap truncate'>
                    {late_items.map((item, index) => (
                        <ItemCard item={item} index={index} />
                    ))}
                </div>
            )}
        </div>
    )
}