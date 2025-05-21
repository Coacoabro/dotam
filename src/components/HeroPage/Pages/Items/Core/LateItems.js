import { useEffect, useState } from "react"
import NthItems from "./NthItems"
import { setOriginalNode } from "typescript"

export default function LateItems({items}){

    const [lateItems, setLateItems] = useState(items)

    useEffect(() => {
        setLateItems(items)
    }, [items])

    if (lateItems){
        return(
            <div className="flex custom-scrollbar p-2 sm:p-4 gap-1.5 sm:gap-3">
                {Object.entries(lateItems).map(([nth, nthItems]) => (
                    <div>
                        <NthItems items={nthItems} order={nth} />
                    </div>
                ))}
            </div>
        )
    }
}