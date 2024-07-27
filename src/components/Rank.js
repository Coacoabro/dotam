import json from '../../json/Rank.json'
import { useState } from 'react'
import { useRouter } from 'next/router';

export default function Rank() {

  const [isOpen, setIsOpen] = useState(false)
  const [currName, setCurrName] = useState("All Ranks")
  const [currIcon, setCurrIcon] = useState("")
  const router = useRouter()

  const handleClick = (rank, name, icon) => {
      router.push({
          pathname: router.pathname,
          query: { ...router.query, rank }
      })
      setIsOpen(false)
      setCurrName(name)
      setCurrIcon(icon)
  }

  return(
      <div className='relative'>
        <button onClick={() => setIsOpen(!isOpen)} className='text-xs sm:text-lg h-8 w-24 sm:w-44 sm:h-10 px-1.5 sm:px-3.5 sm:py-2 bg-slate-900 rounded-lg border border-slate-700 justify-between items-center gap-1 inline-flex'>
          <div className='flex items-center'>
            {currIcon ? <img src={currIcon} className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" /> : null}
            {currName}
          </div>
          <img src="/Frame.png" className='w-2 sm:w-4'/>
        </button>

        {isOpen && (
                <div className="absolute mt-1 sm:mt-2 w-24 sm:w-44 bg-slate-800 shadow-lg text-center rounded-lg border border-slate-700">
                    {json.map((rank) => (
                        <div
                            onClick={() => handleClick(rank.rank, rank.name, rank.icon)}
                            className="text-xs sm:text-lg flex items-center p-2 hover:bg-slate-700 cursor-pointer"
                        >
                            {rank.icon ? <img src={rank.icon} className="w-4 h-4 sm:w-6 sm:h-6 mr-2" /> : null}
                            {rank.name}
                        </div>
                    ))}
                </div>
            )}
          
      </div>
  )
}