import Item from '../../../Item'

export default function CoreItems({core, isCarry}) {

    if(core){
        const items = core.core
        const wr = ((core.wins/core.matches)*100).toFixed(1)
        const dispMatches = core.matches.toLocaleString()
        const wrColor = wr >= 51.5 ? 'text-[#ABDEED]' 
            : wr >= 48.5 ? 'text-slate-200'
            : 'text-[#F46E58]'
    
        if(isCarry){
            return(
                <div className='space-y-1'>
                    <div className='flex justify-between items-center px-2'>
                        <div className='flex items-center gap-1'>
                            <h1 className={`${wrColor} text-base sm:text-xl`}>{wr}%</h1>
                            <h2 className='text-xs sm:text-base opacity-50'>WR</h2>
                        </div>
                        <div className='text-xs sm:text-base opacity-50 whitespace-nowrap truncate'>{dispMatches} Matches</div>
                    </div>
                    <div className='flex sm:gap-2.5 items-center sm:px-2'>
                        <Item id={items[0]} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        <Item id={items[1]} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        <Item id={items[2]} />
                    </div>
                </div>
            )
        }
        else {
            return(
                <div className='flex items-end justify-evenly'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-1'>
                            <h1 className={`${wrColor} text-base sm:text-lg`}>{wr}%</h1>
                            <h2 className='text-xs sm:text-sm opacity-50'>WR</h2>
                        </div>
                        <div className='text-2xs sm:text-sm opacity-50 whitespace-nowrap truncate'>{dispMatches} Matches</div>
                    </div>
                    <div className='flex gap-2.5 items-center'>
                        <Item id={items[0]} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        <Item id={items[1]} />
                    </div>
                </div>
            )
        }
    
    }
}