import { useState, useEffect } from 'react'
import CoreItems from './CoreItems'

export default function Core({items, matches, isCarry}) {

    const [cores, setCores] = useState(() => {
        const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
        return temp
    })
    
    useEffect(() => {
        setCores(()=>{
            const temp = items.sort((a, b) => b.Matches - a.Matches).slice(0, 3);
            return temp
        })
    }, [items])

    console.log(isCarry)

    return(
        <div className='space-y-3'>
            <div className='flex items-end gap-2.5'>
                <h1 className='text-xl font-bold'>Core Items</h1>
                <h2 className='opacity-50'>Best main items to initally purchase</h2>
            </div>
            <div className='rounded-lg border border-slate-800'>
                <table className="table-auto w-full text-slate-200 leading-tight font-medium rounded-lg bg-slate-900 text-center">
                    <thead>
                        <tr>
                            <th className="bg-slate-950 rounded-tl-lg py-2 border-b border-slate-800">1ST</th>
                            <th className="bg-slate-950 py-2 border-b border-slate-800">2ND</th>
                            {isCarry ? <th className="bg-slate-950 py-2 border-b border-slate-800">3RD</th> : null}
                            <th className="bg-slate-800 py-2">WR</th>
                            <th className="bg-slate-800 rounded-tr-lg py-2">MATCHES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cores ? cores.map((core) => (
                            <CoreItems core={core} matches={matches} isCarry={isCarry} />
                        )) : null}
                    </tbody>
                </table>
            </div>
        </div>
    )
}