import StartingContainer from "./StartingContainer";

export default function Starting({hero, items}) {
    return(
        <div className="bg-slate-900 rounded-lg py-2 px-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5 px-2 sm:px-0">
                <div className="flex items-end gap-2">
                    <h1 className='text-lg sm:text-2xl font-bold '>Starting</h1>
                    {/* <h2 className='text-lg text-gray-300/50 hidden sm:block'>Best staring items for {hero.localized_name}</h2> */}
                </div>
            </div>
            <div className="py-4 bg-slate-950 rounded-lg space-y-4 overflow-y-auto h-96 overflow-x-hidden custom-scrollbar z-0">
                {items ? items.map((starting, index) => (
                    <>
                        <StartingContainer items={starting} />
                        {index !== items.length-1 ? <div className="bg-slate-800 h-[1px] w-full"/> : null}
                    </>
                )) : null}
            </div>
        </div>
    )
}   