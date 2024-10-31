import ability_ids from "../../../../../../dotaconstants/build/ability_ids"

export default function AbilityRow( {order, abilityPath, matches, wins} ) {


    const wr = ((wins/matches)*100).toFixed(1)
    const wrColor = wr >= 51.5 ? 'text-[#ABDEED]' 
        : wr >= 48.5 ? 'text-slate-200'
        : 'text-[#F46E58]'
    const imgURL = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/"
    const talentURL = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg"

    return(
        <tr className={`${order % 2 ? null : "bg-slate-950"} hover:bg-slate-900 ${order != 9 ? 'border-b-2 border-slate-800' : null}`}>
            <td className="flex space-x-3 py-3 px-4 sm:py-6 sm:px-8 overflow-x-scroll sm:overflow-visible min-w-[540px]">
                {abilityPath.map((ability, index) => (
                    <div className="relative">
                        <img className="w-6 sm:w-10 rounded-lg" src={ability > 0 ? imgURL + ability_ids[ability] + ".png" : talentURL} />
                        <div className='hidden sm:block sm:text-base sm:absolute -mt-6 ml-5 sm:-mt-5 sm:ml-6'><div>{index+1}</div></div>
                    </div>
                ))}
            </td>
            
            <td className={`${wrColor} text-xs sm:text-lg`}>{wr}%</td>
            <td className="text-xs sm:text-lg text-right sm:text-center">{matches.toLocaleString()}</td>
        </tr>
    )
}