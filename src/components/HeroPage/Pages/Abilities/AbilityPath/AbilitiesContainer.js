import AbilityPath from "./AbilityPath";

export default function AbilitiesContainer( { abilities, hero } ){
    return(
        <div className='space-y-2 sm:space-y-4 bg-slate-950 py-2 sm:py-4 px-4 mx-auto rounded-xl border border-slate-800'>
            <div className="flex items-center gap-2.5 px-2 sm:px-0">
                <div className="flex items-end gap-2">
                    <h1 className='text-lg sm:text-[18px]/[24px] font-bold '>Ability Paths</h1>
                    <h2 className='text-[14px]/[20px] text-gray-300/50 hidden sm:block'>Best ability paths for {hero.localized_name}</h2>
                </div>
            </div>

            <AbilityPath abilities={abilities} />
        </div>
    )
}