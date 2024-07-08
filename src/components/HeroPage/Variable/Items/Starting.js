import {useState, useEffect} from 'react'
import Item from '../../Item'

export default function Starting({items}) {

    const [starting, setStarting] = useState(() => {
        let max = 0
        let temp = null
        items.forEach((obj) => {
            if(obj.Matches > max){
                max = obj.Matches
                temp = obj.Starting
            }
        })
        return temp
    })
    
    useEffect(() => {
        setStarting(() => {
            let max = 0
            let temp = null
            items.forEach((obj) => {
                if(obj.Matches > max){
                    max = obj.Matches
                    temp = obj.Starting
                }
            })
            return temp
        })
    }, [items])

    return(
        <div className="space-y-3">
            <div className='flex items-end gap-2.5'>
                <div className='text-xl font-bold'>Starting Items</div>
                {/* <div className='opacity-50'>Best items to start with</div> */}
            </div>
            <div className='bg-slate-900 rounded-lg border border-slate-800 px-4 py-3'>
                {starting ?
                    <div className="grid grid-cols-3 gap-2 rounded-md place-items-center">
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