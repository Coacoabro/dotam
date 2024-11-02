import Link from 'next/link'
import { useRouter } from 'next/router'
import files from '../../../json/navigation.json'
import { useEffect, useState } from 'react'



export default function Navigation() {

    const router = useRouter()

    const [openSections, setOpenSections] = useState({})


    const toggleSection = (title) => {
        setOpenSections(prev => ({
            ...prev,
            [title]: !prev[title],
        }))
    }

    useEffect(() => {
        files.forEach(file => {
            if (file.subPaths) {
                file.subPaths.forEach(subFile => {
                    if (router.asPath == subFile.path) {
                        setOpenSections(prev => ({
                            ...prev,
                            [file.title]: true,
                        }))
                    }
                })
            }
        })
    }, [router.asPath, files])


    return (
        <div className='p-4 flex flex-col space-y-2 text-xl'>
            {files.map(file => (
                <div>
                    {file.subPaths ? (
                        <div className={``}>
                            <button 
                                className='p-2 rounded w-full flex justify-between hover:bg-slate-900'
                                onClick={()=>toggleSection(file.title)}
                            >
                                {file.title}
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" viewBox="0 0 24 24" 
                                    strokeWidth={1.5} stroke="currentColor" 
                                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${openSections[file.title] ? 'rotate-90' : ''}`}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                            {openSections[file.title] && (
                                <div>
                                    {file.subPaths.map(subFile => (
                                        <Link href={`${subFile.path}`}>
                                            <div className={`${router.asPath == subFile.path ? 'bg-slate-800 font-bold' : null} px-8 py-1 rounded hover:bg-slate-900 text-lg`}>
                                                {subFile.title}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                            <Link href={`${file.path}`}>
                                <div className={`${router.asPath == file.path ? 'bg-slate-800 font-bold' : null} p-2 rounded hover:bg-slate-900`}>
                                    {file.title}
                                </div>
                            </Link>
                        )
                    }
                </div>
            )

            )}
        </div>
    )
}

