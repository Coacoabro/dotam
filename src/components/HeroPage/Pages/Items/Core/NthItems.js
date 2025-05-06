import NthItem from "./NthItem"

export default function NthItems({items, order, n}){

    return(
        <div className="bg-slate-900 py-2 sm:py-4 space-y-2 sm:space-y-4 rounded-lg w-24 sm:w-28 flex-col flex items-center">
            <div className="font-bold px-2 text-sm sm:text-base">
                {order + n}{order + n == 3 ? 'RD' : 'TH'} ITEM
            </div>
            <div className="h-[1px] bg-slate-800 w-full"/>
            {items.map(item => (
                <NthItem item={item} />
            ))}
        </div>
    )
    
}