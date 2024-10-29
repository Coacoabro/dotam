import Link from 'next/link'
import { useRouter } from 'next/router'



export default function Navigation( {files} ) {

    const router = useRouter()

    console.log(router.asPath)


    return (
        <div className='p-4 flex flex-col space-y-2 '>
            {files.map(file => (
                <Link href={`/basics/${file.name.replace(' ', '-')}`}>
                    <div className={`${router.asPath == '/basics/' + file.name.replace(' ', '-') ? 'bg-slate-800 font-bold' : null} px-2 py-1 rounded hover:bg-slate-900`}>
                        {file.name.charAt(0).toUpperCase() + file.name.slice(1)}
                    </div>
                </Link>
            ))}
        </div>
    )
}

