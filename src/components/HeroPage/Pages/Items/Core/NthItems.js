import NthItem from "./NthItem"

export default function NthItems({items, order}){

    return(
        <div className="border-slate-900 bg-gray-gradient py-2 sm:py-4 space-y-2 sm:space-y-4 rounded-xl w-24 sm:w-28 flex-col flex items-center">
            <div className="font-bold px-2 text-[16px]/[24px] text-white/[64%]">
                {order}{order == 3 ? 'RD' : 'TH'} ITEM
            </div>
            <div className="h-[1px] bg-slate-800 w-full"/>
            {items.map(item => (
                <NthItem item={item} />
            ))}
            
        </div>
    )
    
}