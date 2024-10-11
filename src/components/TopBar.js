import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import SearchTopBar from './SearchTopBar'

export default function TopBar() {

    const router = useRouter()
    const path = router.asPath

    const [dropDown, setDropDown] = useState(false)
    const [expandSearch, setExpandSearch] = useState(false)

    return(
        <div className='z-50 fixed w-screen shadow-md bg-slate-950'>
            <div className={`flex h-16 sm:h-24 w-screen items-center ${path == '/' || path == '/heroes' ? 'px-4 sm:px-20 lg:px-28' : 'px-4 sm:px-8 lg:px-14'}`}>
                <div className='absolute flex items-center left-100 gap-4'>
                    <Link href='/' onClick={() => setDropDown(false)}><img src="/DotamLogoShortLight.png" className="w-12 sm:w-16" /></Link>
                </div>
                <div className={`hidden sm:inline-flex absolute text-xs sm:text-lg items-center space-x-1 sm:space-x-4 lg:space-x-10 sm:right-16 lg:right-24`}>
                    <Link href="/heroes" className={`px-3 py-1 rounded-md ${path == '/heroes' ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Heroes</Link>
                    <Link href="/tier-list" className={`px-3 py-1 rounded-md ${path.includes('tier-list') ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Tier List</Link>
                    {/* <Link href="/basics" className={`px-3 py-1 rounded-md ${path.includes('basic') ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Basics</Link> */}
                    {path == '/' || path == '/heroes' ? null : <div className='z-50 flex'><SearchTopBar /></div>}
                </div>
                <div className='absolute gap-2.5 transition-all duration-1000 delay-100 ease-in-out right-2 sm:right-8 flex sm:hidden'>
                    <div className='z-50 flex'><SearchTopBar /></div>
                    <button onClick={() => setDropDown(!dropDown)}><img className='w-8 h-8' src="/burger-menu.svg" /></button>
                </div>
            </div>
            <div className={`flex flex-col text-lg text-center overflow-hidden z-0 transition-all duration-1000 delay-100 ease-in-out ${dropDown ? 'max-h-72' : 'max-h-0'}`}>
                <Link href="/heroes" onClick={() => setDropDown(!dropDown)} className={`px-6 py-4 ${path == '/heroes' ? 'bg-slate-600 text-slate-200 font-bold' : null} hover:bg-slate-500`}>Heroes</Link>
                <Link href="/tier-list" onClick={() => setDropDown(!dropDown)} className={`px-6 py-4 ${path.includes('tier-list') ? 'bg-slate-600 text-slate-200 font-bold' : null} hover:bg-slate-500`}>Tier List</Link>
                {/* <Link href="/basics" onClick={() => setDropDown(!dropDown)} className={`px-6 py-4 ${path.includes('basic') ? 'bg-slate-600 text-slate-200 font-bold' : null} hover:bg-slate-500`}>Basics</Link> */}
            </div>
            <div className={`h-[0.5px] ${path == '/heroes' || path == '/' ? 'w-11/12' : null} bg-gray-700 mx-auto transition duration-300 ease-in-out`} />
        </div>
    )
}