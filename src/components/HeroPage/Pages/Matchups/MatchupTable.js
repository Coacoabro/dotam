import { useEffect, useState } from 'react';
import heroInfo from '../../../../../json/dota2heroes.json'
import allHeroes from '../../../../../dotaconstants/build/heroes.json'
import MatchupRow from './MatchupRow';
import { useRouter } from 'next/router';

export default function MatchupTable( { search, matchups, initRole, type } ) {

    const router = useRouter()
    const { role, rank } = router.query

    const [currHeroBuild, setCurrHeroBuild] = useState(matchups.filter(obj => obj.role == role || initRole && obj.rank == rank || ""))

    const [currMatchups, setCurrMatchups] = useState(currHeroBuild.length > 0 ? currHeroBuild[0][type] : [])

    useEffect(() => {

        const currRole = role || initRole
        const currRank = rank || ""

        setCurrHeroBuild(matchups.filter(obj => obj.role == currRole && obj.rank == currRank))
        
    }, [role, rank, matchups, initRole])

    useEffect(() => {

        let heroesByRR = currHeroBuild.length > 0 ? currHeroBuild[0][type] : []

        if (search && heroInfo) {
            let filteredHeroes = []
            heroesByRR.map((hero) => {
                heroInfo.map((obj) => {
                    if(hero.Hero == obj.id){
                        if(obj.name.toLowerCase().includes(search.toLowerCase())){
                            filteredHeroes.push(hero)
                        }
                    }
                })
            })
            setCurrMatchups(filteredHeroes)
        }
        else setCurrMatchups(currHeroBuild.length > 0 ? currHeroBuild[0][type] : [])

    }, [currHeroBuild, search, heroInfo])

    return(
        <div className="overflow-y-auto custom-scrollbar bg-slate-950 rounded-lg shadow border border-slate-800 pb-4 w-full">
            <table className="table-auto text-slate-200 font-medium font-['Inter'] font-sans leading-tight text-xl">
                <tr className="border-b-2 border-slate-800">
                    <th className="text-left px-8 py-3 w-full z-10">
                        Heroes
                    </th>
                    <th className="">
                        <button className=" flex items-center py-3 px-8">WR</button>
                    </th>
                    <th className="">
                        <button className="flex items-center py-3 px-8">Matches</button>
                    </th>
                </tr>
                <tbody className="text-lg">
                    {currMatchups.map((obj, index) => (
                        <MatchupRow hero={obj} order={index} info={allHeroes[obj.Hero]} />
                    ))}
                </tbody>
            </table>
        </div>
    )
    
}