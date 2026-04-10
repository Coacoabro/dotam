import Item from "../../../Item"

export default function StartingContainer({items}){

    const wr = ((items.Wins / items.Matches) * 100).toFixed(2)
    const wrColor = wr >= 51.5 ? 'text-[#ABDEED]' 
    : wr >= 48.5 ? 'text-slate-200'
    : 'text-[#F46E58]'
    const matches = items.Matches.toLocaleString()

    return(
        <div className="px-4 space-y-2">
            <div className="flex justify-between items-center text-[14px]/[20px] ">
                <p className={`font-bold ${wrColor}`}>{wr}% <span className="opacity-75">WR</span></p>
                <p className="opacity-50">{matches} Matches</p>
            </div>
            <div className="grid grid-cols-3 gap-2 place-items-center">
                {items.Starting.map((item, index) => (
                    <Item id={item} />
                ))}
            </div>
        </div>
    )
}