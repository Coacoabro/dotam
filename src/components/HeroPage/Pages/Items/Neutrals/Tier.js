import ItemCard from "../../Builds/Items/ItemCard";

export default function Tier({items, tier}){
    return(
        <div className='rounded-lg w-44 sm:w-56'>
            <div className='font-medium text-center py-1 text-lg bg-slate-950 rounded-t-lg border-t border-l border-r border-slate-800'>TIER {tier}</div>
            <div className='w-full h-[1px] bg-slate-800' />
            <div className='flex flex-col bg-slate-800 py-3 space-y-2 px-2 rounded-b-lg sm:items-center whitespace-nowrap truncate'>
                {items ? items.map((item, index) => (
                    <ItemCard item={item} index={index} />
                )) : null}
            </div>
        </div>
    )
}