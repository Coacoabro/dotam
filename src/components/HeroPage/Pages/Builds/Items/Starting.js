import {useState, useEffect} from 'react'
import Item from '../../../Item'

export default function Starting({items}) {

    const [starting, setStarting] = useState(items.Starting)
    
    useEffect(() => {
        setStarting(items.Starting.length > 0 ? items.Starting : items.Starting)
    }, [items])

    return(
        <div className="bg-black-gradient space-y-4 border border-slate-900 rounded-xl h-[200px] ">
            <div className='items-end gap-2 px-5 pt-3'>
                <div className='text-lg sm:text-xl font-bold'>Starting Items</div>
            </div>
            <div className='rounded-b-lg px-2 py-3'>
                {starting ?
                    <div className="grid grid-cols-3 gap-2 place-items-center">
                        {starting.map((item, index) => (
                            <Item id={item} />
                        ))}
                    </div>
                    :
                    <div>Not enough data</div>}
            </div>
            
            
        </div>
    )
}