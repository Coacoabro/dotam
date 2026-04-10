import abilityIds from "../../../../../../dotaconstants/build/ability_ids"
import heroAbilities from "../../../../../../dotaconstants/build/hero_abilities.json"
import Abilities from "../../../../../../dotaconstants/build/abilities.json"
import TalentRow from "./TalentRow"


export default function TalentOptions({talents, hero}) {

    const Talents = []

    const heroName = hero.name

    const init_talents = talents
    console.log(init_talents)


    if(talents){

        const tempTalents = []
        talents.forEach((talent) => {
            const tempTalent = abilityIds[talent.Talent]
            if(tempTalent) {
                if(Abilities[tempTalent]){
                    if(Abilities[tempTalent].dname){
                        const talentObj = {
                            "Talent": Abilities[tempTalent].dname.replace(/\{[^}]*\}/g, '?'),
                            "Wins": talent.Wins,
                            "Matches": talent.Matches
                        }
                        tempTalents.push(talentObj)
                    }
                }
            }
        })

        const talentOrder = heroAbilities[heroName].talents

        talentOrder.forEach((talent) => {
            const talentName = Abilities[talent.name].dname.replace(/\{[^}]*\}/g, '?')
            tempTalents.forEach((temp) => {
                if(talentName == temp.Talent){
                    Talents.push(temp)
                }
            })
        })

        const rightTalents = [Talents[6], Talents[4], Talents[2], Talents[0]]
        const leftTalents = [Talents[7], Talents[5], Talents[3], Talents[1]]

        console.log(rightTalents, leftTalents)

        const levels = [25, 20, 15, 10]

        return(
            <div className='space-y-2 sm:space-y-4 bg-slate-950 py-2 px-4 sm:px-4 sm:py-6 mx-auto rounded-xl border border-slate-800'>
                <div className="flex items-center gap-2.5 px-2 sm:px-0">
                    <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg" className='h-7 w-7 sm:h-6 sm:w-6' />
                    <div className="flex items-end gap-2">
                        <h1 className='text-lg sm:text-[18px]/[24px] font-bold '>Talents</h1>
                        <h2 className='text-[14px]/[20px] text-gray-300/50 hidden sm:block'>Best talents for {hero.localized_name}</h2>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-lg space-y-4">
                    {levels.map((_, index) => (
                        <>
                            <TalentRow level={levels[index]} right={rightTalents[index]} left={leftTalents[index]} />
                        </>
                    ))}
                </div>
            </div>
        )
    }

    
}