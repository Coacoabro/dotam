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
            {/* Desktop */}
            <div className={`hidden sm:flex sm:h-16 w-screen items-center justify-between px-4 sm:px-8 lg:px-32`}>
                <Link href='/' onClick={() => setDropDown(false)}><img src="/DotamLogoShortLight.png" className="w-12 sm:w-[48px]" /></Link>
                <div className={`hidden sm:inline-flex text-xs sm:text-lg items-center space-x-1 sm:space-x-4 lg:space-x-10`}>
                    <Link href="/heroes" className={`px-3 py-4 ${path == '/heroes' ? 'border-b' : 'opacity-60'} hover:border-b `}>Heroes</Link>
                    <Link href="/tier-list" className={`px-3 py-4 ${path.includes('tier-list') ? 'border-b' : 'opacity-60'} hover:border-b`}>Tier List</Link>
                    {/* <Link href="/basics/introduction/welcome" className={`px-3 py-1 rounded-md ${path.includes('basic') ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Basics</Link> */}
                    <div className='z-50 flex'><SearchTopBar /></div>
                </div>
            </div>

            {/* Mobile */}
            <div className='sm:hidden flex justify-between items-center px-4 py-2'>
                <Link href='/' onClick={() => setDropDown(false)}><img src="/DotamLogoShortLight.png" className="w-12 sm:w-[64px]" /></Link>
                <div className='flex gap-2.5 transition-all duration-1000 delay-100 ease-in-out'>
                    <div className='z-50 flex'><SearchTopBar /></div>
                    <button onClick={() => setDropDown(!dropDown)}><img className='w-8 h-8' src="/burger-menu.svg" /></button>
                </div>
            </div>
        


            <div className={`flex flex-col text-lg text-center overflow-hidden z-0 transition-all duration-1000 delay-100 ease-in-out ${dropDown ? 'max-h-72' : 'max-h-0'}`}>
                <Link href="/heroes" onClick={() => setDropDown(!dropDown)} className={`px-6 py-4 ${path == '/heroes' ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Heroes</Link>
                <Link href="/tier-list" onClick={() => setDropDown(!dropDown)} className={`px-6 py-4 ${path.includes('tier-list') ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Tier List</Link>
                {/* <Link href="/basics/introduction/welcome" onClick={() => setDropDown(!dropDown)} className={`px-6 py-4 ${path.includes('basic') ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Basics</Link> */}
            </div>
        </div>
    )
}