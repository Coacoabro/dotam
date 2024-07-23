import Link from 'next/link'
import { useRouter } from 'next/router'
import SearchBar from './SearchBar'

export default function TopBar() {

    const router = useRouter()

    const path = router.asPath

    return(
        <div className='z-50 fixed w-screen shadow-md bg-[#020617]'>
            <div className={`flex h-24 w-screen items-center ${path == '/' || path == '/heroes' ? 'px-4 sm:px-20 lg:px-28' : 'px-4 sm:px-8 lg:px-14'}`}>
                <div className='absolute flex items-centerleft-100'>
                    <Link href='/'><img src="/DotamLogoShortLight.png" className="w-16" /></Link>
                </div>
                
                <div className={`${path == '/' || path == '/heroes' ? 'hidden' : 'absolute left-1/4 translate-x-1/2'}`}><SearchBar topBar={true} /></div>
                <div className='absolute flex items-center space-x-1 sm:space-x-6 lg:space-x-10 right-8 sm:right-12 lg:right-24'>
                    <Link href="/heroes" className={`px-3 py-1 rounded-md ${path == '/heroes' ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Heroes</Link>
                    <Link href="/tier-list" className={`px-3 py-1 rounded-md ${path.includes('tier-list') ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Tier List</Link>
                    <Link href="/basics" className={`px-3 py-1 rounded-md ${path.includes('basic') ? 'bg-indigo-300 text-black font-bold' : null} hover:bg-slate-500`}>Basics</Link>
                    {/* <button className='rounded-md hover:bg-slate-700 p-2'><img src="/cogwheel.png" className="w-5 h-5" /></button> */}
                </div>
            </div>
            <div className={`h-[0.5px] ${path == '/heroes' || path == '/' ? 'w-11/12' : null} bg-gray-700 mx-auto`} />
        </div>
    )
}