import {useState, useEffect} from 'react'
import ItemCard from './ItemCard'

export default function Early({items}) {

    const [early, setEarly] = useState(items.slice(0, 6))
    
    useEffect(() => {
        setEarly(items.slice(0, 6))
    }, [items])

    return(
        <div className="space-y-1 bg-slate-900 rounded-lg border border-slate-800 h-full">
            <div className='sm:flex items-end gap-2.5 px-5 pt-3 '>
                <div className='text-lg sm:text-xl font-bold '>Early Items</div>
                <div className='opacity-50'>Best items to get early on</div>
            </div>

            <div className='py-4 px-4 gap-2 rounded-b-lg'>
                {early ?
                    <div className="flex flex-col justify-center items-center space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:place-items-center">
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