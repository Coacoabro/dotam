import { useEffect, useState } from "react";
import CoreContainer from "./CoreContainer";
import MobileCoreContainer from "./MobileCoreContainer";

export default function Core({hero, items, isCarry}){
    
    const [currItems, setCurrItems] = useState(items)

    useEffect(() => {
        setCurrItems(items)
    }, [items])

    return(
        <div className="bg-slate-900 rounded-lg py-2 sm:py-4 px-4 sm:px-8 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5 px-2 sm:px-0">
                <div className="flex items-end gap-2 w-1/3">
                    <h1 className='text-lg sm:text-2xl font-bold '>Core Items</h1>
                    <h2 className='text-lg text-gray-300/50 hidden sm:block'>First set of items</h2>
                </div>
                <div className="flex items-end gap-2 hidden sm:block">
                    <h1 className='text-lg sm:text-2xl font-bold'>Late Game Items</h1>
                    <h2 className='text-lg text-gray-300/50 hidden sm:block'>Get these after selecting your core items!</h2>
                </div>
            </div>

            <div className="hidden sm:block">
                <CoreContainer items={currItems} isCarry={isCarry} />
            </div>
            <div className="sm:hidden">
                <MobileCoreContainer items={currItems} isCarry={isCarry} />
            </div>
        </div>
    )
}