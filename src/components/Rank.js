import json from '../../json/Rank.json'
import { useState } from 'react'
import { useRouter } from 'next/router';

export default function Rank() {

  const [isOpen, setIsOpen] = useState(false)
  const [currName, setCurrName] = useState("All Ranks")
  const [currIcon, setCurrIcon] = useState("")
  const router = useRouter()

  const Ranks = json.filter(rankObj => !["HIGH", "MID", "LOW"].includes(rankObj.rank))

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
        <button onClick={() => setIsOpen(!isOpen)} className='bg-slate-900 sm:text-lg h-8 w-24 sm:w-44 sm:h-10 px-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-700 justify-between items-center gap-1 inline-flex'>
          <div className='flex items-center'>
            {currIcon ? <img src={currIcon} className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" /> : null}
            {currName}
          </div>
          <img src="/Frame.png" className='w-3 sm:w-4'/>
        </button>

        {isOpen && (
                <div className="absolute mt-1 sm:mt-2 w-24 sm:w-44 bg-slate-900 shadow-lg text-center rounded-lg border border-slate-700">
                    {Ranks.map((rank) => (
                        <div
                            onClick={() => handleClick(rank.rank, rank.name, rank.icon)}
                            className={`sm:text-lg flex items-center p-2 hover:bg-slate-700 cursor-pointer ${rank.rank == "" ? "rounded-t" : rank.rank == "HERALD" ? "rounded-b" : null}`}
                        >
                            {rank.icon ? <img src={rank.icon} className={`w-5 h-5 sm:w-6 sm:h-6 mr-2`} /> : null}
                            {rank.name}
                        </div>
                    ))}
                </div>
            )}
          
      </div>
  )
}