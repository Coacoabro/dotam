import { useEffect, useState } from "react";
import CoreItems from "./CoreItems";
import LateItems from "./LateItems";

export default function CoreContainer({items, isCarry}){

    const [currCore, setCurrCore] = useState(items[0])

    useEffect(() => {
        setCurrCore(items[0])
    }, [items])

    return(
        <div className="bg-slate-950 rounded-lg border border-slate-800 flex h-[800px]">
            <div className="overflow-y-auto hidden-scrollbar w-[25%]">
                {items.map(core => (
                    <button 
                        className={`${core == currCore ? null : 'bg-slate-900 border border-slate-800 opacity-50'} p-2 hover:bg-slate-950 hover:opacity-100 w-full`}
                        onClick={()=>setCurrCore(core)}
                    >
                        <CoreItems core={core} isCarry={isCarry} />
                    </button>
                ))}
            </div>
            <div className="w-3/4 overflow-y-auto custom-scrollbar">
                <LateItems items={currCore.Late} isCarry={isCarry} />
            </div>
        </div>
    )
}