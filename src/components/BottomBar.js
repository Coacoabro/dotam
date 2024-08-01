import { useRouter } from 'next/router'

export default function BottomBar() {

    const router = useRouter()
    const path = router.asPath


    return(
        <div className={`${path == '/' ? 'top-[35vh]' : null} ${path == '/basics' ? 'hidden' : ''} relative p-4 w-screen shadow-md bg-slate-900 bottom-0 border border-t-slate-700`}>
            <div className='flex items-center justify-between max-w-5xl mx-auto py-5'>
                <div className='space-y-2'>
                    <img src="/DotamLogoLight.png" className='w-72'/>
                    <div>© 2024 DotaM, LLC. All rights reserved.</div>
                </div>
                <div className='space-y-2'>
                    <h1>Data 2 Data Provided by:</h1>
                    <a href="https://www.stratz.com" target="_blank" className='text-cyan-200 flex items-end gap-1 hover:underline'>
                        <img src="/StratzLogo.svg" className='w-6 h-6'/> 
                        Stratz
                    </a>
                    <a href="https://www.opendota.com" target="_blank" className='text-cyan-200 flex items-end gap-1 hover:underline'>
                        <img src="/OpenDotaLogo.svg" className='w-6 h-6'/>
                        OpenDota
                    </a>
                </div>
            </div>
        </div>
    )
}