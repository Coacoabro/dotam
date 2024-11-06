import { useEffect, useState } from "react"
import CoreItems from "./CoreItems";
import LateItems from "./LateItems";

export default function MobileCoreContainer({items, isCarry}){

    const [currCore, setCurrCore] = useState(items[0])

    useEffect(() => {
        setCurrCore(items[0])
    }, [items])

    return(
        <div className="bg-slate-950 rounded-lg ">
            <div className="overflow-y-auto hidden-scrollbar h-64 border border-slate-800 flex flex-col items-center">
                {items.map(core => (
                    <button 
                        className={`${core == currCore ? null : 'bg-slate-900 border border-slate-800 opacity-50'} p-2 hover:bg-slate-950 hover:opacity-100 w-full`}
                        onClick={()=>setCurrCore(core)}
                    >
                        <CoreItems core={core} isCarry={isCarry} />
                    </button>
                ))}
            </div>
            <div className="text-lg bg-slate-900 w-full px-2 py-2 font-bold">Late Game Items</div>
            <div className="overflow-y-auto custom-scrollbar">
                <LateItems items={currCore.late} isCarry={isCarry} />
            </div>
        </div>
    )
}