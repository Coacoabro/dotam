import { useState } from 'react'
import Item from '../../../Item'
import CorePermutations from './CorePermutations'

export default function CoreItems({core, isCarry}) {

    if(core){

        const [showPermutations, setShowPermutations] = useState(false)
        const cores = core.Permutations
        const items = cores[0].core
        const wr = ((core.CombinedWins/core.CombinedMatches)*100).toFixed(1)
        const dispMatches = core.CombinedMatches.toLocaleString()
    
        if(isCarry){
            return(
                <>
                    <div 
                        className='flex items-center gap-3 sm:gap-4 px-4 pb-2 pt-3 ' 
                        onMouseEnter={() => setShowPermutations(true)}
                        onMouseLeave={() => setShowPermutations(false)}
                    >
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
                        <div>
                            <div className='flex items-center gap-1'>
                                <h1 className='text-base sm:text-lg'>{wr}%</h1>
                                <h2 className='text-xs sm:text-sm opacity-50'>WR</h2>
                            </div>
                            <div className='text-2xs sm:text-sm opacity-50 whitespace-nowrap truncate'>{dispMatches} Matches</div>
                        </div>
                    </div>
                    {showPermutations ? (
                        <div className='absolute'>
                            <CorePermutations cores={cores} isCarry={isCarry} />
                        </div>
                    ) : null}
                </>
            )
        }
        else {
            return(
                <div className='flex items-end justify-evenly'>
                    <div className='flex gap-2.5 items-center'>
                        <Item id={items[0]} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        <Item id={items[1]} />
                    </div>
                    <div>
                        <div className='flex items-center gap-1'>
                            <h1 className='text-base sm:text-lg'>{wr}%</h1>
                            <h2 className='text-xs sm:text-sm opacity-50'>WR</h2>
                        </div>
                        <div className='text-xs sm:text-sm opacity-50'>{dispMatches} Matches</div>
                    </div>
                </div>
            )
        }
    
    }
}