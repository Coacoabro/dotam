import EarlyTable from "./EarlyTable";

export default function Early({hero, items}){

    return(
        <div className="bg-slate-950 rounded-xl py-4 px-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5 px-2 sm:px-0">
                <div className="flex items-end gap-2 sm:text-[18px]/[24px]">
                    <h1 className='font-bold '>Early</h1>
                    <h2 className='text-[14px]/[20px] text-gray-300/50 hidden sm:block'>Best early items for {hero.localized_name}</h2>
                </div>
            </div>

            <EarlyTable items={items} />
            
        </div>
    )
}