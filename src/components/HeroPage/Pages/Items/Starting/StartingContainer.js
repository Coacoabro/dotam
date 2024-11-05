import Item from "../../../Item"

export default function StartingContainer({items}){

    const wr = ((items.wins / items.matches) * 100).toFixed(2)
    const wrColor = wr >= 51.5 ? 'text-[#ABDEED]' 
    : wr >= 48.5 ? 'text-slate-200'
    : 'text-[#F46E58]'
    const matches = items.matches.toLocaleString()

    return(
        <div className="px-4 space-y-2">
            <div className="flex justify-between items-center">
                <p className={`sm:text-xl ${wrColor}`}>{wr}% <span className="text-xs sm:text-sm text-slate-200">WR</span></p>
                <p className="text-xs sm:text-sm">{matches} Matches</p>
            </div>
            <div className="grid grid-cols-3 gap-2 place-items-center">
                {items.starting.map((item, index) => (
                    <Item id={item} />
                ))}
            </div>
        </div>
    )
}