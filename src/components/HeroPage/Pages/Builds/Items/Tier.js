import NeutralItemCard from "../../Builds/Items/NeutralItemCard";

export default function Tier({items, tier}){

    const tieredItems = items.slice(0, 4)

    return(
        <div className='rounded-lg sm:w-40 border border-slate-800'>
            <div className='font-medium text-center py-1 text-[16px]/[24px] b rounded-t-lg'>TIER {tier}</div>
            <div className='w-full h-[1px] bg-slate-800' />
            <div className='flex flex-col bg-[#0B0D1CCC] py-3 space-y-2 px-2 rounded-b-lg line-clamp-1 inline-block'>
                {tieredItems ? tieredItems.map((item, index) => (
                    <NeutralItemCard item={item} index={index} />
                )) : null}
            </div>
        </div>
    )
}