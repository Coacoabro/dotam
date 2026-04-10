import { useState, useEffect } from 'react'
import CoreItems from './CoreItems'

export default function Core({items, isCarry, sendLate}) {

    const cores = items
    const [selectedCore, setSelectedCore] = useState(0)

    const handleClick = (select) => {
        setSelectedCore(select)
        sendLate(cores[select].Late)
    }

    return(
        <div className='space-y-1'>
            <div className='sm:flex items-end gap-2.5 px-5 pt-4'>
                <h1 className='text-lg sm:text-xl font-bold'>Core Item Builds</h1>
                <h2 className='opacity-50'>First set of items to purchase</h2>
            </div>
            <div className={`px-3 pt-3 flex ${isCarry ? "justify-between" : "space-x-4"}`}>

                {cores.map((core, key) => (
                    <div className={`${selectedCore == key ? "bg-border-fade" : ""} pt-[1px] px-[1px] rounded-t-xl`}>
                        <div className='bg-slate-950 rounded-t-xl'>
                            <button 
                                className={`rounded-t-xl ${selectedCore == key ? 'bg-gray-gradient' : 'bg-slate-950'} w-full hover:bg-gray-gradient`}
                                onClick={()=>handleClick(key)}
                            >
                                <CoreItems core={core} isCarry={isCarry} />
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}