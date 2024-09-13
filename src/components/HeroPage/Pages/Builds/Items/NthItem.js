import {useState, useEffect} from 'react'
import ItemCard from './ItemCard'

export default function NthItem({order, items}){

    const [nthItems, setNthItems] = useState(() => {
        const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
        return temp
    })
    
    useEffect(() => {
        setNthItems(()=>{
            const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
            return temp
        })
    }, [items])

    return(
        <div className='rounded-lg border border-slate-800 bg-slate-950 w-48'>
            <div className=' font-medium text-center py-1 text-lg'>{order}{order == 3 ? "RD" : "TH"}</div>
            <div className='w-full h-[1px] bg-slate-800' />
            <div className='bg-slate-800 py-3 space-y-2 px-2 rounded-b-lg items-center'>
                {nthItems.map((item, index) => (
                    <ItemCard item={item} index={index} />
                ))}
            </div>
        </div>
    )
}