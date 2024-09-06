import { useState } from 'react'
import { useRouter } from 'next/router'

export default function HeroSearch({onSearch}) {

    const router = useRouter()

    const [inputValue, setInputValue] = useState('')

    const handleChange = (event) => {
        setInputValue(event.target.value)
        onSearch(event.target.value)
    }

    console.log(scrollY)
    
    return(
        <div className={`${scrollY == 0 && !router.pathname.includes('/heroes') ? 'w-[300px] sm:w-[800px] lg:w-[1200px]' : 'w-[300px] sm:w-[700px] lg:w-[800px]'} transition-all duration-500 ease-in-out mx-auto shadow-sm rounded-[36px] overflow-hidden border border-slate-700 flex items-center`}>
            <div className="flex-1 h-[25px] sm:h-[44px] px-3 py-[12px] flex items-center">
                <img src="/Search.png" alt="Search Icon" className="w-4 h-4" />
                <div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Search a hero"
                        className={`${scrollY == 0 && !router.pathname.includes('/heroes') ? 'lg:w-[1050px]' : 'sm:w-[550px]'} text-slate-200 text-[15px] font-medium leading-5 bg-transparent border-none outline-none flex-1 tracking-wide px-2`}
                    />
                </div>
            </div>
            <button className={`w-[80px] text-xs sm:text-sm sm:w-[94px] h-[30px] sm:h-[45px] sm:px-5 py-[9px] bg-gray-900 z-20 border-l border-slate-700 flex justify-center items-center text-slate-200 font-medium tracking-wide`}>
                Search
            </button>
        </div>
    )
}