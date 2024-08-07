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
        <div className="space-y-3 rounded-lg border border-slate-800">
            <div className='sm:flex items-end gap-2.5 px-5 pt-3 '>
                <div className='text-lg sm:text-xl font-bold '>Early Items</div>
                <div className='opacity-50'>Best items to get early on</div>
            </div>

            <div className='pt-4 px-4 pb-2 gap-2 bg-slate-900 rounded-b-lg'>
                {early ?
                    <div className="flex flex-col justify-center items-center space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 gap-2 sm:place-items-center">
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