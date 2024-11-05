import CoreContainer from "./CoreContainer";

export default function Core({hero, items, isCarry}){
    return(
        <div className="bg-slate-900 rounded-lg py-4 px-8 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5 px-2 sm:px-0">
                <div className="flex items-end gap-2 w-1/3">
                    <h1 className='text-lg sm:text-2xl font-bold '>Core Items</h1>
                    <h2 className='text-lg text-gray-300/50 hidden sm:block'>First set of items</h2>
                </div>
                <div className="flex items-end gap-2">
                    <h1 className='text-lg sm:text-2xl font-bold '>Late Game Items</h1>
                    <h2 className='text-lg text-gray-300/50 hidden sm:block'>Get these after selecting your core items!</h2>
                </div>
            </div>

            <CoreContainer items={items} isCarry={isCarry} />
        </div>
    )
}