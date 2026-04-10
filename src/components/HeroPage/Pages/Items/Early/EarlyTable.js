import EarlyRow from "./EarlyRow";


export default function EarlyTable({items}){

    return(
        <div className="overflow-y-auto custom-scrollbar bg-slate-950 rounded-lg shadow border border-slate-800 h-96">
            <table className="table-auto sm:w-full text-slate-200 font-medium font-['Inter'] font-sans leading-tight text-sm sm:text-xl">
                <tr className="border-b-2 border-slate-800 text-[13px]/[20px] text-[#6C7A8E]">
                    <th className="text-left px-8 py-2 sm:w-3/5">
                        Item
                    </th>
                    <th className="sm:w-1/12">
                        <button className=" flex items-center py-2">WR</button>
                    </th>
                    <th className="sm:w-1/12">
                        <button className="flex items-center py-2">Matches</button>
                    </th>
                </tr>
                <tbody className="text-lg">
                    {items.map((obj, index) => (
                        <EarlyRow order={index} item={obj.Item} secondpurchase={obj.isSecondPurchase} matches={obj.Matches} wins={obj.Wins} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}