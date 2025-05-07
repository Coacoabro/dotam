import { useState } from 'react'
import { useRouter } from 'next/router';
import json from '../../json/Role.json'


export default function Role( {initRole} ) {

    const router = useRouter()

    const { role } = router.query

    const [currRole, setCurrRole] = useState(role || initRole || "")
    const [hovered, setHovered] = useState(null)

    const handleClick = (role) => {
        router.replace(
            {
                pathname: router.pathname,
                query: { ...router.query, role }
            }, 
            undefined, 
            { scroll: false, shallow: true }
        )
        setCurrRole(role)
    }

    return(
        <div className="flex h-8 gap-2 sm:gap-2.5 items-center">
            {router.asPath.includes('tier-list') || router.pathname == '/' || router.pathname == '/heroes' ? json.map((role) => (
                <button 
                    onClick={() => handleClick(role.role)} 
                    onMouseEnter={() => setHovered(role.role)}
                    onMouseLeave={() => setHovered(null)}
                    className={`text-sm font-bold items-center flex justify-center w-10 sm:w-12 h-7 sm:h-8 py-1 px-2 rounded-lg hover:bg-slate-600 ${currRole == role.role ? 'bg-cyan-300 text-black' : 'text-white border border-slate-700'}`}
                >
                    <div className={`${hovered == role.role && hovered != "" ? "" : "hidden"} absolute -mt-20 bg-slate-950 border border-slate-700 py-1 px-2 rounded-lg text-white`}>
                        {role.name}
                    </div>
                    {role.role == "" ? <div>{role.name}</div> : <img src={currRole == role.role ? role.selected : role.icon} className="h-full" />}
                </button>
            )) : router.asPath.includes('matchups') ? (
                <>
                    <button
                        onClick={() => handleClick("All")}
                        className={`text-sm font-bold items-center flex justify-center w-10 sm:w-12 h-7 sm:h-8 py-1 px-2 rounded-lg hover:bg-slate-600 ${currRole == "All" ? 'bg-cyan-300 text-black' : 'text-white border border-slate-700'}`}
                    >
                        All
                    </button>
                    {json.filter((r) => r.role !== "").map((role) => (
                        <button 
                            onClick={() => handleClick(role.role)} 
                            onMouseEnter={() => setHovered(role.role)}
                            onMouseLeave={() => setHovered(null)}
                            className={`text-sm font-bold items-center flex justify-center w-12 h-8 py-1 px-2 rounded-lg hover:bg-slate-600 ${currRole == role.role ? 'bg-cyan-300 text-black' : 'text-white border border-slate-700 bg-slate-900'}`}
                        >
                            <div className={`${hovered == role.role && hovered != "" ? "" : "hidden"} absolute -mt-16 bg-slate-950 border border-slate-700 py-1 px-2 rounded-lg text-white`}>
                                {role.name}
                            </div>
                            {role.role == "" ? <div>{role.name}</div> : <img src={currRole == role.role ? role.selected : role.icon} className="h-full" />}
                        </button>
                    ))}
                </>
            ) :
            json.filter((r) => r.role !== "").map((role) => (
                <button 
                    onClick={() => handleClick(role.role)}
                    onMouseEnter={() => setHovered(role.role)}
                    onMouseLeave={() => setHovered(null)}
                    className={`text-sm font-bold items-center flex justify-center w-12 h-8 py-1 px-2 rounded-lg hover:bg-slate-600 ${currRole == role.role ? 'bg-cyan-300 text-black' : 'text-white border border-slate-700 bg-slate-900'}`}
                >
                    <div className={`${hovered == role.role && hovered != "" ? "" : "hidden"} absolute -mt-16 bg-slate-950 border border-slate-700 py-1 px-2 rounded-lg text-white`}>
                        {role.name}
                    </div>
                    {role.role == "" ? <div>{role.name}</div> : <img src={currRole == role.role ? role.selected : role.icon} className="h-full" />}
                </button>
            ))
            }
        </div>
    )
}