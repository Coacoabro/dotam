import abilityIds from "../../../../../../dotaconstants/build/ability_ids"
import heroAbilities from "../../../../../../dotaconstants/build/hero_abilities.json"
import Abilities from "../../../../../../dotaconstants/build/abilities.json"


export default function TalentOptions({talents, hero}) {

    const Talents = []

    const heroName = hero.name

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
            <div className='space-y-2 sm:space-y-4 bg-slate-900 py-4 px-8 w-11/12 mx-auto rounded-lg border border-slate-800'>
                <div className="flex items-center gap-2.5 px-2 sm:px-0">
                    <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg" className='h-7 w-7 sm:h-8 sm:w-8' />
                    <div className="flex items-end gap-2">
                        <h1 className='text-lg sm:text-xl font-bold '>Talents</h1>
                        <h2 className='text-gray-300/50 hidden sm:block'>Best talents for {hero.localized_name}</h2>
                    </div>
                </div>
                <div className='text-gray-300/50 sm:hidden px-3'>Best talents for {hero.localized_name}</div>
            </div>
        )
    }

    
}