export default function Starting({hero, items}) {
    return(
        <div className="bg-slate-900 rounded-lg py-4 px-8 border border-slate-800">
            <div className="flex items-center gap-2.5 px-2 sm:px-0">
                <div className="flex items-end gap-2">
                    <h1 className='text-lg sm:text-2xl font-bold '>Starting</h1>
                    <h2 className='text-lg text-gray-300/50 hidden sm:block'>Best staring items for {hero.localized_name}</h2>
                </div>
            </div>
        </div>
    )
}   