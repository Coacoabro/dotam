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
        <button onClick={() => setIsOpen(!isOpen)} className='w-44 h-10 px-3.5 py-2 bg-slate-900 rounded-lg border border-slate-700 justify-between items-center gap-1 inline-flex'>
          <div className='flex items-center'>
            {currIcon ? <img src={currIcon} className="w-6 h-6 mr-2" /> : null}
            {currName}
          </div>
          <img src="/Frame.png" className='w-4'/>
        </button>

        {isOpen && (
                <div className="absolute mt-2 w-44 bg-slate-800 shadow-lg text-center">
                    {json.map((rank) => (
                        <div
                            onClick={() => handleClick(rank.rank, rank.name, rank.icon)}
                            className="flex items-center p-2 hover:bg-slate-700 cursor-pointer"
                        >
                            {rank.icon ? <img src={rank.icon} className="w-6 h-6 mr-2" /> : null}
                            {rank.name}
                        </div>
                    ))}
                </div>
            )}
          
      </div>
  )
}