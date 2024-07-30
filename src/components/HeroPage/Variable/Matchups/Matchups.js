import Matchup from './Matchup'

export default function Matchups({type, matchups, hero}){

    const topFive = []

    if (type == "against") {
        matchups.sort((a, b) => a.WR - b.WR).slice(0, 5).map((matchup) => {
            topFive.push(matchup)
        })
    }
    else {
        matchups.slice(0, 5).map((matchup) => {
            topFive.push(matchup)
        })
    }

    return(
        <div className='sm:space-y-2'>
            <div className='flex gap-2.5 items-center sm:items-end py-1'>
                <h1 className='text-base sm:text-xl font-bold'>{type == "against" ? "Counters" : "Synergies"}</h1>
                <h2 className='text-xs sm:text-base text-gray-300 opacity-50'>Best heroes to play {type} {hero.localized_name}</h2>
            </div>
            <div className='flex justify-between items-center overflow-x-scroll gap-1 overflow-y-hidden h-full'>
                {topFive.map((matchup) => (
                    <Matchup matchup={matchup} />
                ))}
            </div>
            
        </div>
    )
}