import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'

export default function TopBar() {

    const router = useRouter()
    const path = router.asPath

    const [dropDown, setDropDown] = useState(false)

    return(
        <div className='z-50 fixed w-screen shadow-md bg-[#020617]'>
            <div className={`flex h-16 sm:h-24 w-screen items-center ${path == '/' || path == '/heroes' ? 'px-4 sm:px-20 lg:px-28' : 'px-4 sm:px-8 lg:px-14'}`}>
                <div className='absolute flex items-center left-100 gap-4'>
                    <Link href='/' onClick={() => setDropDown(false)}><img src="/DotamLogoShortLight.png" className="w-12 sm:w-16" /></Link>
                </div>
                
                <div className={`${path == '/' || path == '/heroes' ? 'hidden' : 'hidden absolute left-1/4 translate-x-1/2'}`}><SearchBar topBar={true} /></div>
                <div className={`hidden sm:block absolute flex text-xs sm:text-lg items-center space-x-1 sm:space-x-6 lg:space-x-10 right-4 sm:right-12 lg:right-24`}>
                    <Link href="/heroes" className={`px-3 py-1 rounded-md ${path == '/heroes' ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Heroes</Link>
                    <Link href="/tier-list" className={`px-3 py-1 rounded-md ${path.includes('tier-list') ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Tier List</Link>
                    <Link href="/basics" className={`px-3 py-1 rounded-md ${path.includes('basic') ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Basics</Link>
                    {/* <button className='rounded-md hover:bg-slate-700 p-2'><img src="/cogwheel.png" className="w-5 h-5" /></button> */}
                </div>
                <div className='absolute overflow-hidden transition-all duration-1000 delay-100 ease-in-out right-8 flex gap-2 sm:hidden'>
                    <button onClick={() => setDropDown(!dropDown)}><img className='w-8 h-8' src="/burger-menu.svg" /></button>
                </div>
            </div>
            <div className={`flex flex-col text-lg text-center overflow-hidden transition-all duration-1000 delay-100 ease-in-out ${dropDown ? 'max-h-72' : 'max-h-0'}`}>
                <div className={`py-6`}><SearchBar /></div>
                <Link href="/heroes" onClick={() => setDropDown(!dropDown)} className={`px-6 py-4 ${path == '/heroes' ? 'bg-slate-600 text-slate-200 font-bold' : null} hover:bg-slate-500`}>Heroes</Link>
                <Link href="/tier-list" onClick={() => setDropDown(!dropDown)} className={`px-6 py-4 ${path.includes('tier-list') ? 'bg-slate-600 text-slate-200 font-bold' : null} hover:bg-slate-500`}>Tier List</Link>
                <Link href="/basics" onClick={() => setDropDown(!dropDown)} className={`px-6 py-4 ${path.includes('basic') ? 'bg-slate-600 text-slate-200 font-bold' : null} hover:bg-slate-500`}>Basics</Link>
            </div>
            <div className={`h-[0.5px] ${path == '/heroes' || path == '/' ? 'w-11/12' : null} bg-gray-700 mx-auto transition duration-300 ease-in-out`} />
        </div>
    )
}