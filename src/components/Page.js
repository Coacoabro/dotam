import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";


export default function Page({ hero, page, currOptions }) {

    const router = useRouter() 

    const [entered, setEntered] = useState(false)

    return(
        <div className="space-y-2">
            <div className={`${router.asPath.includes(page) ? "bg-border-fade" : ""} rounded-[10px] p-[1px]`}>
                <div className="bg-slate-950 rounded-[10px]">
                    <Link 
                    href={`/hero/${hero}/${page}${currOptions ? currOptions : ''}`} 
                    onMouseEnter={()=>setEntered(true)}
                    onMouseLeave={()=>setEntered(false)}
                    className={`
                        sm:text-lg flex items-center hover:opacity-100 px-4 py-2 rounded-[10px]
                        ${router.asPath.includes(page) ? "text-cyan-300 bg-gradient-to-t from-[#435061]/0 to-[#435061] font-semibold" : "opacity-50"}
                    `}
                    >
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                    </Link>
                </div>
            </div>
            
            <div className={`${router.asPath.includes(page) || entered ? "" : "hidden"} h-[2px] w-[24px] bg-cyan-300 rounded-full mx-auto`} />

        </div>
    )
}