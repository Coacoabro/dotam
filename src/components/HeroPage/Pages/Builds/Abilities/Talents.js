import Abilities from '../../../../../../dotaconstants/build/abilities.json'
import heroAbilities from '../../../../../../dotaconstants/build/hero_abilities.json'
import abilityIds from '../../../../../../dotaconstants/build/ability_ids.json'

export default function Talents({hero, talents}) {

    const heroName = hero.name

    const Talents = []

    if(talents){

        talents.forEach((talent) => {
            const tempTalent = abilityIds[talent.Talent]
            if(tempTalent) {
                if(Abilities[tempTalent].dname){
                    talent.Talent = Abilities[tempTalent].dname.replace(/\{[^}]*\}/g, '?')
                }
            }
        })

        const talentOrder = heroAbilities[heroName].talents

        talentOrder.forEach((talent) => {
            if(Abilities[talent.name].dname){Talents.push(Abilities[talent.name].dname.replace(/\{[^}]*\}/g, '?'))}
        })

        const rightTalents = [Talents[6], Talents[4], Talents[2], Talents[0]]
        const leftTalents = [Talents[7], Talents[5], Talents[3], Talents[1]]

        const bestTalents = Array(4)
        const prArray = Array(4)

        for (let i=3; i>-1; i--) {
            let leftTalent = talents.find((obj) => obj.Talent == leftTalents[i])
            let rightTalent = talents.find((obj) => obj.Talent == rightTalents[i])
            if(leftTalent && rightTalent) {
                if (leftTalent.Matches > rightTalent.Matches) {
                    bestTalents[i] = leftTalents[i];
                } else {
                    bestTalents[i] = rightTalents[i];
                }
            }
        }
        
        const levels = [25, 20, 15, 10]


        return(
            <div className='space-y-2 sm:space-y-4'>
                <div className="flex items-center gap-2.5 px-2 sm:px-0">
                    <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg" className='h-7 w-7 sm:h-8 sm:w-8' />
                    <div className="flex items-end gap-2">
                        <h1 className='text-lg sm:text-xl font-bold '>Talents</h1>
                        <h2 className='text-gray-300/50 hidden sm:block'>Best talents for {hero.localized_name}</h2>
                    </div>
                </div>
                <div className='text-gray-300/50 sm:hidden px-3'>Best talents for {hero.localized_name}</div>
                <div className="flex flex-col text-2xs sm:text-xs items-center space-y-1 sm:space-y-3 sm:px-6 py-2 sm:py-5 bg-slate-950 text-left rounded-lg border-slate-600">
                    {levels.map((level, index) => (
                        <div className='space-y-3'>
                            <div className="flex items-center space-x-1 sm:space-x-3 px-2 sm:px-4">
                                <div className={`w-32 sm:w-40 h-12 p-1 rounded-md text-center flex justify-center items-center ${bestTalents.includes(leftTalents[index]) ? 'bg-slate-800  text-slate-300 border border-slate-700/50' : 'text-slate-300/50'}`}>
                                    {leftTalents[index]}
                                </div>
                                <div className="relative flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 bg-slate-800 rounded-full shadow-md">
                                    <span className="text-slate-200 text-sm sm:text-lg text-center font-bold">
                                        {level}
                                    </span>
                                </div>
                                <div className={`w-32 sm:w-40 h-12 p-1 rounded-md text-center flex justify-center items-center ${bestTalents.includes(rightTalents[index]) ? 'bg-slate-800 text-slate-300 border border-slate-700/50' : 'text-slate-300/50'}`}>
                                    {rightTalents[index]}
                                </div>
                            </div>
                            {index < 0 ? (
                                <div className="h-[2px] w-10/12 bg-slate-700 flex justify-center mx-auto" />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}