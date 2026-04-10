import { useState } from 'react'
import { useRouter } from 'next/router'

export default function HeroSearch({onSearch, scrollY}) {

    const router = useRouter()

    const [inputValue, setInputValue] = useState('')

    const handleChange = (event) => {
        setInputValue(event.target.value)
        onSearch(event.target.value)
    }

    
    return(
        <div className={`${router.pathname.includes('/tier-list') ? 'w-[400px] h-[48px]' : 'w-[300px] sm:w-[640px] h-[65px]'} mx-auto bg-search-border p-[1px] rounded-full`}>
            <div className={`
                ${router.pathname.includes('/tier-list') ? 'w-[400px] h-[48px]' : 'w-[300px] sm:w-[640px] h-[64px]'} 
                transition-all duration-500 ease-in-out 
                mx-auto shadow-sm rounded-full overflow-hidden 
                flex items-center px-2 bg-[#253447]`
            }>
                <div className="flex-1 h-[25px] sm:h-[44px] px-3 py-[12px] flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Filter for your hero..."
                        className={`${scrollY == 0 && !router.pathname.includes('/heroes') ? 'lg:w-[1050px]' : 'sm:w-[300px]'} text-slate-200 text-lg bg-transparent border-none outline-none flex-1 tracking-wide px-2`}
                    />
                </div>
                <button className={`bg-gradient-to-t from-[#FCC5C5] to-[#A5C9F3] rounded-full ${router.pathname.includes('/tier-list') ? "p-2" : "p-3"}`}>
                    <img src="/Search.png" alt="Search Icon" className={`${router.pathname.includes('/tier-list') ? "w-[16px] h-[16px]" : "w-6 h-6"} invert`} />
                </button>
            </div>
        </div>
    )
}