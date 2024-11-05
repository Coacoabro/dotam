import NthItems from "./NthItems"

export default function LateItems({items, isCarry}){

    const orderedItems = Array.from({length: 7}, () => [])
    const n = isCarry ? 4 : 3

    items.forEach(item => {
        if (item.nth >= 3 && item.nth <=10) {
            orderedItems[item.nth - n].push(item)
        }
    })

    return(
        <div className="flex custom-scrollbar p-4 gap-2">
            {orderedItems.map((nthItems, index) => (
                <div>
                    <NthItems items={nthItems} order={index} n={n} />
                </div>
            ))}
        </div>
    )
}