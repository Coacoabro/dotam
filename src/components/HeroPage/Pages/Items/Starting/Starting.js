import StartingContainer from "./StartingContainer";

export default function Starting({hero, items}) {
    return(
        <div className="bg-slate-950 rounded-xl py-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5 px-4">
                <div className="flex items-end gap-2">
                    <h1 className='text-[18px]/[24px] font-bold '>Starting</h1>
                    {/* <h2 className='text-[14px]/[20px] text-gray-300/50 hidden sm:block'>Best staring items for {hero.localized_name}</h2> */}
                </div>
            </div>
            <div className="py-4 rounded-lg space-y-4 overflow-y-auto h-96 overflow-x-hidden custom-scrollbar z-0">
                {items ? items.map((starting, index) => (
                    <>
                        <StartingContainer items={starting} />
                        {index !== items.length-1 ? <div className="bg-border-fade h-[1px] w-[60%] mx-auto"/> : null}
                    </>
                )) : null}
            </div>
        </div>
    )
}   