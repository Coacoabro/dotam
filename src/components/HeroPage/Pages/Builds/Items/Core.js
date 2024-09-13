import { useState, useEffect } from 'react'
import CoreItems from './CoreItems'

export default function Core({items, matches, isCarry}) {

    const [cores, setCores] = useState(() => {
        const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
        return temp
    })

    const [selectedCore, setSelectedCore] = useState(1)
    
    useEffect(() => {
        setCores(()=>{
            const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
            return temp
        })
    }, [items])

    return(
        <div className='bg-slate-900 rounded-lg border border-slate-800 space-y-1'>
            <div className='sm:flex items-end gap-2.5 px-5 pt-3'>
                <h1 className='text-lg sm:text-xl font-bold'>Core Item Builds</h1>
                <h2 className='opacity-50'>First three items to purchase</h2>
            </div>
            <div className='p-3 rounded-b-lg'>

                <button 
                    className={`rounded-t-lg ${selectedCore == 1 ? 'bg-slate-800' : 'bg-slate-950'} px-4 py-2 w-full hover:bg-slate-800`}
                    onClick={()=>setSelectedCore(1)}
                >
                    <CoreItems core={cores[0]} matches={matches} isCarry={isCarry} />
                </button>

                <button 
                    className={`${selectedCore == 2 ? 'bg-slate-800' : 'bg-slate-950'} px-4 py-2 w-full hover:bg-slate-800`}
                    onClick={()=>setSelectedCore(2)}
                >
                    <CoreItems core={cores[1]} matches={matches} isCarry={isCarry} />
                </button>
                <button 
                    className={`rounded-b-lg ${selectedCore == 3 ? 'bg-slate-800' : 'bg-slate-950'} px-4 py-2 w-full hover:bg-slate-800`}
                    onClick={()=>setSelectedCore(3)}
                >
                    <CoreItems core={cores[2]} matches={matches} isCarry={isCarry} />
                </button>
            </div>
        </div>
    )
}