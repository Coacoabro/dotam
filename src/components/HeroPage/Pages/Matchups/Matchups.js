import { useState, useEffect } from 'react'
import { useRouter } from "next/router"
import MatchupTable from './MatchupTable'
import HeroSearch from '../../../Home/Heroes/HeroSearch'


export default function Matchups({ heroData, initRole, heroMatchups }) {

    const [searchTerm, setSearchTerm] = useState('')

    const [wORa, setWORA] = useState('Against')

    const handleSearch = (term) => {
      setSearchTerm(term)
    }

    if(heroMatchups){

        return(
            <div className='space-y-2 sm:space-y-4 bg-slate-900 py-2 sm:py-4 px-3 sm:px-6 mx-auto rounded-lg border border-slate-800'>
                <div className="sm:flex items-center gap-2.5 px-2 sm:px-0 justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-end gap-2">
                        <h1 className='text-xl sm:text-2xl font-bold '>Matchups</h1>
                        <h2 className='text-lg text-gray-300/50 hidden sm:block'>All hero matchups for {heroData.localized_name}</h2>
                    </div>
                    <div className="sm:flex items-center justify-center space-x-2 space-y-4 sm:w-1/3">
                        <HeroSearch onSearch={handleSearch} />
                        <div className='flex sm:hidden justify-center'>
                            <button 
                                className={`rounded-l-full py-1 px-2 text-center w-20 border border-slate-700 ${wORa == 'Against' ? 'bg-cyan-300 text-black font-bold' : ''}`}
                                onClick={() => setWORA('Against')}
                            >
                                Against
                            </button>
                            <button 
                                className={`rounded-r-full py-1 px-2 text-center w-20 border border-slate-700 ${wORa == 'With' ? 'bg-cyan-300 text-black font-bold' : ''}`}
                                onClick={() => setWORA('With')}
                            >
                                With
                            </button>
                        </div>
                    </div>
                </div>
                <div className='sm:flex gap-4'>
                    <div className={`${wORa == 'Against' ? null : 'hidden sm:block'} sm:w-1/2`}>
                        <div className="flex items-end gap-2 text-gray-300/50">
                            <h1 className='text-xl font-bold text-red-200/50'>Against:</h1>
                            <h2 className='text-lg hidden sm:block'>Heroes going against {heroData.localized_name}</h2>
                        </div>
                        <MatchupTable matchups={heroMatchups} initRole={initRole} search={searchTerm} type="herovs" />
                    </div>
                    <div className={`${wORa == 'With' ? null : 'hidden sm:block'} sm:w-1/2`}>
                        <div className="flex items-end gap-2 text-gray-300/50">
                            <h1 className='text-xl font-bold text-blue-200/50'>With:</h1>
                            <h2 className='text-lg hidden sm:block'>Heroes who work well with {heroData.localized_name}</h2>
                        </div>
                        <MatchupTable matchups={heroMatchups} initRole={initRole} search={searchTerm} type="herowith" />
                    </div>
                </div>
            </div>

        )
    }
    else {
        return(
            <div className='text-center py-8'>NO MATCHUPS.... yet</div>
        )
    }

}