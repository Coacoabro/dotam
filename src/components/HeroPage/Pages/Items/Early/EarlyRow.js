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
            <tr className={`${order % 2 ? null : "bg-slate-950"} hover:bg-slate-900 ${order != 9 ? 'border-b-2 border-slate-800' : null}`}>
                <td className="flex items-center gap-4 py-3 px-4  overflow-x-scroll sm:overflow-visible min-w-[540px]">
                    <Item id={item} />
                    {itemName}{secondpurchase ? <span className='text-cyan-300'>(2nd Purchase)</span> : null}
                </td>
                
                <td className={`${wrColor} text-xs sm:text-lg`}>{wr}%</td>
                <td className="text-xs sm:text-lg text-right sm:text-center">{matches.toLocaleString()}</td>
            </tr>
        )
    }
    
}