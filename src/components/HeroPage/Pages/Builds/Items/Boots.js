import {useState, useEffect} from 'react'
import ItemCard from './ItemCard'

export default function Boots({items}) {

    const [boots, setBoots] = useState(() => {
        const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
        return temp
    })
    
    useEffect(() => {
        setBoots(()=>{
            const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
            return temp
        })
    }, [items])

    return(
        <div className="py-3 px-5 bg-slate-900 rounded-lg border border-slate-800 space-y-3">
            <div className='flex items-end gap-2.5'>
                <div className='text-xl font-bold'>Boots</div>
                {/* <div className='opacity-50'>Best items to start with</div> */}
            </div>
            
            {boots ?
                <div className="rounded-md place-items-center">
                    {boots.map((item, index) => (
                        <ItemCard item={item} index={index} />
                    ))}
                </div>
                :
                <div>Not enough data</div>}
        </div>
    )
}