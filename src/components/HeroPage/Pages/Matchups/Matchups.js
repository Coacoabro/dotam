import { useState, useEffect } from 'react'
import { useRouter } from "next/router"
import MatchupTable from './MatchupTable'
import HeroSearch from '../../../Home/Heroes/HeroSearch'


export default function Matchups({ heroData, initRole, heroMatchups }) {

    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (term) => {
      setSearchTerm(term)
    }

    return(
        <div className='space-y-2 sm:space-y-4 bg-slate-900 py-4 px-6 mx-auto rounded-lg border border-slate-800'>
            <div className="flex items-center gap-2.5 px-2 sm:px-0 justify-between">
                <div className="flex items-end gap-2">
                    <h1 className='text-lg sm:text-2xl font-bold '>Matchups</h1>
                    <h2 className='text-lg text-gray-300/50 hidden sm:block'>All hero matchups for {heroData.localized_name}</h2>
                </div>
                <div className="flex items-center justify-center space-x-2 w-1/3">
                    <HeroSearch onSearch={handleSearch} />
                </div>
            </div>
            <div className='text-gray-300/50 sm:hidden px-3'>Best talents for {heroData.localized_name}</div>
            <div className='flex gap-4'>
                <div className='w-1/2'>
                    <div className="flex items-end gap-2 text-gray-300/50">
                        <h1 className='text-lg sm:text-xl font-bold text-red-200/50'>Against:</h1>
                        <h2 className='text-lg hidden sm:block'>Heroes going against {heroData.localized_name}</h2>
                    </div>
                    <MatchupTable matchups={heroMatchups} initRole={initRole} search={searchTerm} type="herovs" />
                </div>
                <div className='w-1/2'>
                    <div className="flex items-end gap-2 text-gray-300/50">
                        <h1 className='text-base sm:text-xl font-bold text-blue-200/50'>With:</h1>
                        <h2 className='text-lg hidden sm:block'>Heroes who work well with {heroData.localized_name}</h2>
                    </div>
                    <MatchupTable matchups={heroMatchups} initRole={initRole} search={searchTerm} type="herowith" />
                </div>
            </div>
        </div>

    )

}