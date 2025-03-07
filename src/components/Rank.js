import json from '../../json/Rank.json'
import { useState } from 'react'
import { useRouter } from 'next/router';

export default function Rank() {

    const router = useRouter()

    const { rank } = router.query
    const Ranks = json

    const initRank = rank ? Ranks.find(r => r.rank == rank) : ""

    const [isOpen, setIsOpen] = useState(false)
    const [currName, setCurrName] = useState(initRank.name || "All Ranks")
    const [currIcon, setCurrIcon] = useState(initRank.icon || "")
    

    

    

    const handleClick = (rank, name, icon) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, rank }
        }, undefined, { scroll: false })
        setIsOpen(false)
        setCurrName(name)
        setCurrIcon(icon)
    }

    return(
        <div className='relative z-10'>
            <button onClick={() => setIsOpen(!isOpen)} className={`${router.asPath.includes('/hero/') ? 'bg-slate-900' : 'bg-slate-950'} text-sm sm:text-lg h-8 w-28 sm:w-56 sm:h-10 px-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-700 justify-between items-center gap-1 inline-flex`}>
            <div className='flex items-center'>
                {currIcon ? currName == "High MMR" || "Mid MMR" || "Low MMR" ? <img src={currIcon} className={`${rank == "MID" ? "w-8 sm:w-12" : ""} h-4 sm:h-6 mr-1 sm:mr-2`} /> : <img src={currIcon} className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" /> : null}
                {currName}
            </div>
            <img src="/Frame.png" className='w-3 sm:w-4'/>
            </button>

            {isOpen && (
                    <div className={`absolute mt-1 sm:mt-2 w-28 sm:w-56 ${router.asPath.includes('/hero/') ? 'bg-slate-900' : 'bg-slate-950'}  shadow-lg text-center rounded-lg border border-slate-700`}>
                        {Ranks.map((rank) => (
                            <div
                                onClick={() => handleClick(rank.rank, rank.name, rank.icon)}
                                className={`text-sm sm:text-lg flex items-center p-2 hover:bg-slate-700 cursor-pointer ${rank.rank == "" ? "rounded-t" : rank.rank == "HERALD" ? "rounded-b" : null}`}
                            >
                                {rank.icon ? rank.rank.length <= 4 ? <img src={rank.icon} className={`${rank.rank == 'MID' ? "w-8 sm:w-12" : ""}  h-4 sm:h-6 mr-1 sm:mr-2`} /> : <img src={rank.icon} className={`w-5 h-5 sm:w-6 sm:h-6 mr-2`} /> : null}
                                {rank.name}
                            </div>
                        ))}
                    </div>
                )}
            
        </div>
    )
}