import { useEffect, useState } from "react"
import NthItems from "./NthItems"
import { setOriginalNode } from "typescript"

export default function LateItems({items, isCarry}){

    const [n, setN] = useState(isCarry ? 4 : 3)

    useEffect(() => {
        setN(isCarry ? 4 : 3)
    }, [isCarry])

    if (items){
        return(
            <div className="flex custom-scrollbar p-2 sm:p-4 gap-1.5 sm:gap-3">
                {items.map((nthItems, index) => (
                    <div>
                        <NthItems items={nthItems} order={index} n={n} />
                    </div>
                ))}
            </div>
        )
    }
}