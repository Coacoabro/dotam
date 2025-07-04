import { useState } from "react"
import ability_ids from "../../../../../../dotaconstants/build/ability_ids"
import Abilities from "../../../../../../dotaconstants/build/abilities"

export default function AbilityRow( {order, abilityPath, matches, wins} ) {

    const [hovered, setHovered] = useState(false)

    const wr = ((wins/matches)*100).toFixed(1)
    const wrColor = wr >= 51.5 ? 'text-[#ABDEED]' 
        : wr >= 48.5 ? 'text-slate-200'
        : 'text-[#F46E58]'
    const imgURL = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/"
    const talentURL = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg"

    return(
        <tr className={`${order % 2 ? null : "bg-slate-950"} ${order != 9 ? 'border-b-2 border-slate-800' : null}`}>
            <td className="flex space-x-1 sm:space-x-3 p-2 sm:py-3 sm:px-4 overflow-x-scroll sm:overflow-visible min-w-[540px]">
                {abilityPath.map((ability, index) => (
                    <div className={`relative bg-slate-900 px-1 pb-0.5 rounded-md w-8 sm:w-full`}>
                        <div className="text-center text-xs sm:text-lg">{index+1}</div>
                        <img className="sm:w-10 rounded-lg" src={Abilities[ability_ids[ability]].img ? imgURL + ability_ids[ability] + ".png" : talentURL} />
                    </div>
                ))}
            </td>
            
            <td className={`${wrColor} text-xs sm:text-lg sm:text-center`}>{wr}%</td>
            <td className="text-xs sm:text-lg text-right sm:text-center">{matches.toLocaleString()}</td>
        </tr>
    )
}