import AbilityPath from "./AbilityPath";

export default function AbilitiesContainer( { abilities, hero } ){
    return(
        <div className='space-y-2 sm:space-y-4 bg-slate-900 py-4 px-8 mx-auto rounded-lg border border-slate-800'>
            <div className="flex items-center gap-2.5 px-2 sm:px-0">
                <div className="flex items-end gap-2">
                    <h1 className='text-lg sm:text-2xl font-bold '>Abilities</h1>
                    <h2 className='text-lg text-gray-300/50 hidden sm:block'>Best ability paths for {hero.localized_name}</h2>
                </div>
            </div>
            <div className='text-gray-300/50 sm:hidden px-3'>Best talents for {hero.localized_name}</div>

            <AbilityPath abilities={abilities} />
        </div>
    )
}