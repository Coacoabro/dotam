import { useEffect, useState } from "react"
import NthItems from "./NthItems"
import { setOriginalNode } from "typescript"

export default function LateItems({items, isCarry}){

    const orderedItems = Array.from({length: 7}, () => [])
    const [n, setN] = useState(isCarry ? 4 : 3)

    

    items.forEach(item => {
        if (item.nth >= n && item.nth <=(n+6)) {
            orderedItems[item.nth - n].push(item)
        }
    })

    useEffect(() => {
        setN(isCarry ? 4 : 3)
    }, [isCarry])

    return(
        <div className="flex custom-scrollbar p-4 gap-3">
            {orderedItems.map((nthItems, index) => (
                <div>
                    <NthItems items={nthItems} order={index} n={n} />
                </div>
            ))}
        </div>
    )
}