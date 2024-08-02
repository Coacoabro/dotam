import { useState } from 'react'
import { useRouter } from 'next/router';
import json from '../../json/Role.json'


export default function Role( {initRole} ) {

    const router = useRouter()

    const { role } = router.query

    const [currRole, setCurrRole] = useState(role || initRole || "")

    const handleClick = (role) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, role }
        })
        setCurrRole(role)
    }

    return(
        <div className="flex h-8 gap-2 sm:gap-2.5 items-center">
            {router.asPath.includes('tier-list') ? json.map((role) => (
                <button 
                    onClick={() => handleClick(role.role)} 
                    className={`text-sm font-bold items-center flex justify-center w-10 sm:w-12 h-7 sm:h-8 py-1 px-2 rounded-lg hover:bg-slate-600 ${currRole == role.role ? 'bg-cyan-300 text-black' : 'text-white border border-slate-700'}`}
                >
                    {role.role == "" ? <div>{role.name}</div> : <img src={currRole == role.role ? role.selected : role.icon} className="h-full" />}
                </button>
            )) : 
            json.filter((r) => r.role !== "").map((role) => (
                <button 
                    onClick={() => handleClick(role.role)} 
                    className={`text-sm font-bold items-center flex justify-center w-12 h-8 py-1 px-2 rounded-lg hover:bg-slate-600 ${currRole == role.role ? 'bg-cyan-300 text-black' : 'text-white border border-slate-700 bg-slate-900'}`}
                >
                    {role.role == "" ? <div>{role.name}</div> : <img src={currRole == role.role ? role.selected : role.icon} className="h-full" />}
                </button>
            ))
            }
        </div>
    )
}