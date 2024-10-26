import Link from "next/link";
import heroInfo from '../../../../../json/dota2heroes.json'

export default function MatchupRow( {order, hero, info} ) {

    const heroId = hero.Hero
    const heroName = info.localized_name;
    const heroURL = heroInfo.find(obj => obj.id == heroId).url
    const img = 'https://cdn.cloudflare.steamstatic.com' + info.img

    const wr = hero.WR
    const wrColor = wr >= 51.5 ? 'text-[#ABDEED]' 
        : wr >= 48.5 ? 'text-slate-200'
        : 'text-[#F46E58]'

    return(
       
        <tr className={`${order % 2 ? null : "bg-slate-950"} hover:bg-slate-900`}>
            <td className="py-3 px-8">
                <Link href={`/hero/${heroURL}/builds`} className="flex gap-4 items-center">
                    <img src={img} className="w-24"/>
                    {heroName}
                </Link>
            </td>
            
            <td className={`${wrColor}`}>{wr}%</td>
            <td>{hero.Matches.toLocaleString()}</td>

        </tr>
        
    )

}