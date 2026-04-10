import Item from '../../../Item'
import itemInfo from '../../../../../../dotaconstants/build/items.json'
import itemId from '../../../../../../dotaconstants/build/item_ids.json'

export default function EarlyRow({order, item, secondpurchase, matches, wins}){

    const itemName = itemInfo[itemId[item]].dname

    const wr = ((wins/matches)*100).toFixed(1)
    const wrColor = wr >= 51.5 ? 'text-[#ABDEED]' 
        : wr >= 48.5 ? 'text-slate-200'
        : 'text-[#F46E58]'


    if (itemName){
        return(
            <tr className={`${order % 2 ? "bg-slate-950" : "bg-slate-900"} hover:bg-slate-800 ${order != 9 ? 'border-b-2 border-slate-800' : null} text-[14px]/[20px]`}>
                <td className="text-xs sm:text-base flex items-center gap-4 py-1 px-4  overflow-x-scroll sm:overflow-visible sm:min-w-[540px]">
                    <Item id={item} />
                    {itemName}{secondpurchase ? <span className='text-cyan-300'>(2nd)</span> : null}
                </td>
                
                <td className={`${wrColor} `}>{wr}%</td>
                <td className="">{matches.toLocaleString()}</td>
            </tr>
        )
    }
    
}