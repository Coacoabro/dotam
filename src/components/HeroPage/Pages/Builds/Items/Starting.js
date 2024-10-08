import {useState, useEffect} from 'react'
import Item from '../../../Item'

export default function Starting({items}) {

    const [starting, setStarting] = useState(items[0].starting.length > 0 ? items[0].starting : items[1].starting)
    
    useEffect(() => {
        setStarting(items[0].starting.length > 0 ? items[0].starting : items[1].starting)
    }, [items])

    return(
        <div className="bg-slate-900 space-y-3 border border-slate-800 rounded-lg">
            <div className='items-end gap-2.5 px-5 pt-3'>
                <div className='text-lg sm:text-xl font-bold'>Starting Items</div>
            </div>
            <div className='rounded-b-lg px-4 py-3'>
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