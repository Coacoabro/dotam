import json from '../../json/Patches.json'
import { globalPatch } from '../../config'
import { useState } from 'react'
import { useRouter } from 'next/router';

export default function Patches() {

    const [isOpen, setIsOpen] = useState(false)
    const [currPatch, setCurrPatch] = useState(json[0].Patch)
    const router = useRouter()

    const handleClick = (patch) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, patch }
        })
        setIsOpen(false)
        setCurrPatch(patch)
    }

    return(
        <div className='relative z-50'>
            <button onClick={() => setIsOpen(!isOpen)} className='bg-slate-900 sm:text-lg h-8 w-24 sm:w-28 sm:h-10 px-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-700 justify-between items-center gap-1 inline-flex'>
            <div className='flex items-center'>
                {currPatch}
            </div>
            <img src="/Frame.png" className='w-3 sm:w-4'/>
            </button>

            {isOpen && (
                    <div className="absolute mt-1 sm:mt-2 w-24 sm:w-28 bg-slate-900 shadow-lg text-center rounded-lg border border-slate-700">
                        {json.map((patch) => (
                            <div
                                onClick={() => handleClick(patch.Patch, patch.url)}
                                className="sm:text-lg flex items-center p-2 hover:bg-slate-700 cursor-pointer"
                            >
                                {patch.Patch}
                            </div>
                        ))}
                    </div>
                )}
            
        </div>
    )
}