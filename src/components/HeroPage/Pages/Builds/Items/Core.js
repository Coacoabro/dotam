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
        <div className='bg-slate-900 rounded-lg border border-slate-800 space-y-1'>
            <div className='sm:flex items-end gap-2.5 px-5 pt-3'>
                <h1 className='text-lg sm:text-xl font-bold'>Core Item Builds</h1>
                <h2 className='opacity-50'>First set of items to purchase</h2>
            </div>
            <div className='p-3 rounded-b-lg'>

                <button 
                    className={`rounded-t-lg ${selectedCore == 0 ? 'bg-slate-800' : 'bg-slate-950'} w-full hover:bg-slate-800`}
                    onClick={()=>handleClick(0)}
                >
                    <CoreItems core={cores[0]} isCarry={isCarry} />
                </button>

                <button 
                    className={`${selectedCore == 1 ? 'bg-slate-800' : 'bg-slate-950'} w-full hover:bg-slate-800`}
                    onClick={()=>handleClick(1)}
                >
                    <CoreItems core={cores[1]} isCarry={isCarry} />
                </button>
                <button 
                    className={`rounded-b-lg ${selectedCore == 2 ? 'bg-slate-800' : 'bg-slate-950'} w-full hover:bg-slate-800`}
                    onClick={()=>handleClick(2)}
                >
                    <CoreItems core={cores[2]} isCarry={isCarry} />
                </button>
            </div>
        </div>
    )
}