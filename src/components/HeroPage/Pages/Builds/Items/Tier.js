import NeutralItemCard from "../../Builds/Items/NeutralItemCard";

export default function Tier({items, tier}){
    return(
        <div className='rounded-lg w-36 sm:w-40'>
            <div className='font-medium text-center py-1 text-lg bg-slate-950 rounded-t-lg border-t border-l border-r border-slate-800'>TIER {tier}</div>
            <div className='w-full h-[1px] bg-slate-800' />
            <div className='flex flex-col bg-slate-800 py-3 space-y-2 px-2 rounded-b-lg line-clamp-1 inline-block'>
                {items ? items.map((item, index) => (
                    <NeutralItemCard item={item} index={index} />
                )) : null}
            </div>
        </div>
    )
}