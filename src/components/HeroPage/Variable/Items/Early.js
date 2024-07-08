import {useState, useEffect} from 'react'
import ItemCard from './ItemCard'

export default function Early({items}) {

    const [early, setEarly] = useState(() => {
        const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 6);
        return temp
    })
    
    useEffect(() => {
        setEarly(()=>{
            const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 6);
            return temp
        })
    }, [items])

    return(
        <div className="space-y-3">
            <div className='flex items-end gap-2.5'>
                <div className='text-xl font-bold'>Early Items</div>
                <div className='opacity-50'>Best items to get early on</div>
            </div>

            <div className='pt-4 px-4 pb-2 gap-2 bg-slate-900 rounded-lg border border-slate-800 '>
                {early ?
                    <div className="grid grid-cols-2 gap-2 rounded-md place-items-center">
                        {early.map((item, index) => (
                            <ItemCard item={item} index={index} />
                        ))}
                    </div>
                    :
                    <div>Not enough data</div>}
            </div>
        </div>
    )
}