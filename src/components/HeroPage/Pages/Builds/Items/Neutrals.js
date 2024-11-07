import Tier from "./Tier"

export default function Neutrals({hero, items}){

    const tieredItems = Array.from({length: 5}, () => [])

    items.forEach(item => {
        if (item.tier >= 1 && item.tier <=5) {
            tieredItems[item.tier - 1].push(item)
        }
    })

    return(
        <div className="bg-slate-900 rounded-lg py-2 px-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5 px-2 sm:px-0">
                <div className="flex items-end gap-2">
                    <h1 className='text-lg sm:text-xl font-bold '>Neutrals</h1>
                    <h2 className='text-base text-gray-300/50 hidden sm:block'>Best neutral items for {hero.localized_name}</h2>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex justify-evenly">
                {tieredItems.map((items, index) => (
                    <Tier tier={index+1} items={items} />
                ))}
            </div>

            
        </div>
    )
}