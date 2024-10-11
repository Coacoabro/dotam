import ability_ids from "../../../../../../dotaconstants/build/ability_ids"

export default function AbilityRow( {order, abilityPath, matches, wins} ) {


    const wr = ((wins/matches)*100).toFixed(1)
    const wrColor = wr >= 51.5 ? 'text-[#ABDEED]' 
        : wr >= 48.5 ? 'text-slate-200'
        : 'text-[#F46E58]'
    const imgURL = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/"
    const talentURL = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/talents.svg"

    return(
        <tr className={`${order % 2 ? null : "bg-slate-800"} hover:bg-slate-700`}>
            <td className="flex space-x-3 py-3 px-8">
                {abilityPath.map((ability, index) => (
                    <div className="relative">
                        <img className="w-10 rounded-lg" src={ability > 0 ? imgURL + ability_ids[ability] + ".png" : talentURL} />
                        <div className='absolute -mt-6 ml-5 sm:-mt-5 sm:ml-6'><div>{index+1}</div></div>
                    </div>
                ))}
            </td>
            
            <td className={`${wrColor}`}>{wr}%</td>
            <td>{matches.toLocaleString()}</td>
        </tr>
    )
}