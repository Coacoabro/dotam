import Item from '../../Item'

export default function CoreItems({core, matches, isCarry}) {

    if(core){
        const items = core.Core
        const pr = ((core.Matches/matches)*100).toFixed(1)
        const wr = ((core.Wins/core.Matches)*100).toFixed(1)
        const dispMatches = core.Matches.toLocaleString()
    
        if(isCarry){
            return(
                <div className='flex items-end justify-evenly'>
                    <div className='flex gap-2.5 items-center'>
                        <Item id={items[0]} />
                        🡢
                        <Item id={items[1]} />
                        🡢
                        <Item id={items[2]} />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <h1 className='text-lg'>{wr}%</h1>
                            <h2 className='text-sm opacity-50'>WR</h2>
                        </div>
                        <div className='opacity-50'>({dispMatches} Matches)</div>
                    </div>
                </div>
            )
        }
        else {
            return(
                <div className='flex items-end justify-evenly'>
                    <div className='flex gap-2.5 items-center'>
                        <Item id={items[0]} />
                        🡢
                        <Item id={items[1]} />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <h1 className='text-lg'>{wr}%</h1>
                            <h2 className='text-sm opacity-50'>WR</h2>
                        </div>
                        <div className='opacity-50'>({dispMatches} Matches)</div>
                    </div>
                </div>
            )
        }
    
    }

    
    
}