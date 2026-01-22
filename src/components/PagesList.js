import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function PagesList({ hero }) {

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
        <div className='flex relative z-[35] px-2 space-x-3'>
            <Link href={`/hero/${hero}/builds${currOptions ? currOptions : ''}`} onClick={()=>setIsOpen(false)} className={`sm:text-lg flex items-center hover:underline hover:text-cyan-300 ${router.asPath.includes('builds') ? "underline text-cyan-300" : ""}`}>
                Builds
            </Link>
            <Link href={`/hero/${hero}/items${currOptions ? currOptions : ''}`} onClick={()=>setIsOpen(false)} className={`sm:text-lg flex items-center hover:underline hover:text-cyan-300 ${router.asPath.includes('items') ? "underline text-cyan-300" : ""}`}>
                Items
            </Link>
            <Link href={`/hero/${hero}/abilities${currOptions ? currOptions : ''}`} onClick={()=>setIsOpen(false)} className={`sm:text-lg flex items-center hover:underline hover:text-cyan-300 ${router.asPath.includes('abilities') ? "underline text-cyan-300" : ""}`}>
                Abilities
            </Link>
            {/* <Link href={`/hero/${hero}/matchups${currOptions ? currOptions : ''}`} onClick={()=>setIsOpen(false)} className={`sm:text-lg flex items-center hover:underline hover:text-cyan-300 ${router.asPath.includes('matchups') ? "underline text-cyan-300" : ""}`}>
                Matchups
            </Link> */}
        </div>
    )
}