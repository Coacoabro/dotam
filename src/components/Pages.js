import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Pages({ hero }) {

    const router = useRouter()
    const initPath = router.asPath.split('/').pop()
    const initPage = initPath.split("?")[0]
    const initOptions = initPath.split("?")[1]

    const [isOpen, setIsOpen] = useState(false)
    const [currPage, setCurrPage] = useState(initPage)
    const [currOptions, setCurrOptions] = useState(initOptions != undefined ? '?' + initOptions : '')

    useEffect(() => {
        const initPath = router.asPath.split('/').pop()
        const initPage = initPath.split("?")[0]
        const initOptions = initPath.split("?")[1]
        setCurrPage(initPage)
        setCurrOptions(initOptions != undefined ? '?' + initOptions : '')
    }, [router])

    return(
        <div className='relative z-[35]'>
            <button onClick={() => setIsOpen(!isOpen)} className='bg-slate-900 sm:text-lg h-8 w-16 sm:w-32 sm:h-10 px-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-700 justify-between items-center gap-1 inline-flex'>
            <div className='flex items-center'>
                {currPage.charAt(0).toUpperCase() + currPage.slice(1)}
            </div>
            <img src="/Frame.png" className='w-3 sm:w-4'/>
            </button>

            {isOpen && (
                    <div className="absolute mt-1 sm:mt-2 w-16 sm:w-32 bg-slate-900 shadow-lg text-center rounded-lg border border-slate-700">
                        <Link href={`/hero/${hero}/builds${currOptions ? currOptions : ''}`} onClick={()=>setIsOpen(false)} className="sm:text-lg flex items-center p-2 hover:bg-slate-700 cursor-pointer rounded-t">
                            Builds
                        </Link>
                        <Link href={`/hero/${hero}/items${currOptions ? currOptions : ''}`} onClick={()=>setIsOpen(false)} className="sm:text-lg flex items-center p-2 hover:bg-slate-700 cursor-pointer">
                            Items
                        </Link>
                        <Link href={`/hero/${hero}/abilities${currOptions ? currOptions : ''}`} onClick={()=>setIsOpen(false)} className="sm:text-lg flex items-center p-2 hover:bg-slate-700 cursor-pointer">
                            Abilities
                        </Link>
                        <Link href={`/hero/${hero}/matchups${currOptions ? currOptions : ''}`} onClick={()=>setIsOpen(false)} className="sm:text-lg flex items-center p-2 hover:bg-slate-700 cursor-pointer rounded-b">
                            Matchups
                        </Link>
                    </div>
            )}
            
        </div>
    )
}