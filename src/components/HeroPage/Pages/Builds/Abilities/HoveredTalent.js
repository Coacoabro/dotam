import Abilities from '../../../../../../dotaconstants/build/abilities.json'
import heroAbilities from '../../../../../../dotaconstants/build/hero_abilities.json'
import abilityIds from '../../../../../../dotaconstants/build/ability_ids.json'

export default function HoveredTalent({hero_talents, talent}) {

    const talentName = Abilities[abilityIds[talent]] ? Abilities[abilityIds[talent]].dname.replace(/\{[^}]*\}/g, '?') : ""

    let lrIndex = -1
    let levelIndex = -1

    for (let i = 0; i < hero_talents.length; i++) {
        const j = hero_talents[i].indexOf(talentName)
        if (j != -1) {
            lrIndex = i
            levelIndex = j
            break
        }
    }

    const left_right = ["left", "right"]
    const level = [25, 20, 15, 10]

    return(
        <div className="absolute mt-64 -ml-20 w-48 bg-slate-800 border border-slate-700 rounded-lg p-2 z-50">
            {talentName}
            {/* {left_right[lrIndex]} and level {level[levelIndex]} */}
            {/* <img src="/talent.svg" /> */}
        </div>
    )
}