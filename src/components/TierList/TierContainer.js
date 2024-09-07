import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import TierRow from "./TierRow";

import patches_json from '../../../json/Patches.json'
import LoadingWheel from '../LoadingWheel';
import heroInfo from '../../../json/dota2heroes.json'


export default function TierContainer( {heroes, rates, matchups, search} ) {

    
    const router = useRouter();
    const { role, rank, patch } = router.query 

    const [isLoading, setIsLoading] = useState(false)
    
    const initPatch = patches_json[0].Patch

    const [currentSort, setCurrentSort] = useState("tier_num");
    const [sortBy, setSortBy] = useState("f2l");
    const handleSortClick = (sort, currentSort) => {
        if (sort == currentSort) {
        if (sortBy === "f2l") {
            setSortBy("l2f")
        } else if (sortBy === "l2f") {
            setSortBy("f2l")
        }
        }
        else {setCurrentSort(sort)}
    };

    const [tierList, setTierList] = useState([{}]);
    const [counters, setCounters] = useState([])

    useEffect(() => {

        setIsLoading(true)

        let heroesByRR = [];

        let currentRole = ""
        let currentRank = ""
        let currentPatch = initPatch

        if(role){
        currentRole = role
        }
        if(rank){
        currentRank = rank
        }
        if(patch != currentPatch && patch !== ""){
        currentPatch = patch || initPatch
        }

        setCounters(matchups.filter(r => r.rank.includes(currentRank)))  

        if (currentRole) {
            heroesByRR = rates.filter(r => r.rank === currentRank && r.role === currentRole && r.patch === currentPatch && r.pickrate >= 0.005)
        } else {
            heroesByRR = rates.filter(r => r.rank === currentRank && r.patch === currentPatch && r.pickrate >= 0.005)
        }

        if (search && heroInfo) {
            let filteredHeroes = []
            heroesByRR.map((hero) => {
                heroInfo.map((obj) => {
                    if(hero.hero_id == obj.id){
                        if(obj.name.toLowerCase().includes(search.toLowerCase())){
                            filteredHeroes.push(hero)
                        }
                    }
                })
            })
            heroesByRR = filteredHeroes
        }
        
        if (sortBy === "f2l") {
        setTierList(heroesByRR.sort((a, b) => b[currentSort] - a[currentSort]))
        }
        else if (sortBy === "l2f") {
        setTierList(heroesByRR.sort((a, b) => a[currentSort] - b[currentSort]))
        }

        setIsLoading(false)

    }, [rates, matchups, rank, role, patch, initPatch, currentSort, sortBy, search]);

    console.log(tierList)

    return(
        <div className="overflow-x-auto bg-slate-950 rounded-lg shadow border border-slate-800">
            <table className="table-auto w-full text-slate-200 font-medium font-['Inter'] font-sans leading-tight">
                <thead>
                    <tr className="bg-slate-950 text-white text-sm sm:text-xl text-center">
                    <th className="py-2 px-3 text-center">
                        <button onClick={() => handleSortClick("tier_num", currentSort)}>
                        <div className='flex items-center'>TIER <img src="UpDown.svg" className='w-4 h-4 sm:w-6 sm:h-6' /></div>
                        </button>
                    </th>
                    <th>
                        HERO
                    </th>
                    <th className="flex pt-2 px-2 sm:px-0">
                        ROLE
                    </th>
                    <th className='px-4 sm:px-0'>
                        <button onClick={() => handleSortClick("winrate", currentSort)}>
                        <div className='flex items-center'>WR <img src="UpDown.svg" className='w-4 h-4 sm:w-6 sm:h-6' /></div>
                        </button>
                    </th>
                    <th className='px-4 sm:px-0'>
                        <button onClick={() => handleSortClick("pickrate", currentSort)}>
                        <div className='flex items-center'>PR <img src="UpDown.svg" className='w-4 h-4 sm:w-6 sm:h-6' /></div>
                        </button>
                    </th>
                    <th className='px-4 sm:px-0'>
                        <button onClick={() => handleSortClick("matches", currentSort)}>
                        <div className='flex items-center'>MATCHES <img src="UpDown.svg" className='w-4 h-4 sm:w-6 sm:h-6' /></div>
                        </button>
                    </th>
                    <th className='px-2 hidden lg:flex justify-center'>
                        COUNTERS
                    </th>
                    </tr>
                </thead>
                <tbody className="text-white text-center">
                    {tierList.map((tierItem, index) => (
                        <TierRow
                            index={index}
                            tier_str={tierItem.tier_str}
                            hero={heroes.find(hero => hero.hero_id === tierItem.hero_id)}
                            role={tierItem.role}
                            WR={tierItem.winrate}
                            PR={tierItem.pickrate}
                            matches={tierItem.matches}
                            counters={counters.find(obj => obj.hero_id === tierItem.hero_id && obj.role === tierItem.role)}
                        />
                    ))}
              </tbody>
            </table>
        </div>
    )
}