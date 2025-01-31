import Link from 'next/link'
import { useRouter } from 'next/router'

export default function BottomBar() {

    const router = useRouter()
    const path = router.asPath

    const emailCopy = () => {
        const email = 'support@dotam.gg'
        navigator.clipboard.writeText(email).then(() => {
            alert(email + ' was copied to the clipboard!')
        })
    }


    return(
        <footer aria-hidden="true" className={`${path == '/basics' ? 'hidden' : ''} bottom-0 relative overflow-x-hidden shadow-md bg-slate-950`}>
            {/* <div className='h-[1px] bg-slate-700' /> */}
            <div className={`p-4 space-y-16`}>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-5xl mx-auto py-2 sm:py-5 px-8 lg:px-0 space-y-4'>
                    <div className='space-y-2'>
                        <img src="/DotamLogoLight.png" className='w-56 sm:w-72'/>
                        <div className='text-xs sm:text-base w-max'>© 2024 DotaM, LLC. All rights reserved.</div>
                    </div>
                    <div className='text-sm'>
                        <div className='font-bold'>If you see a bug, report it!</div>
                        <div>Email us at: <button onClick={()=>emailCopy()} className='hover:underline'>support@dotam.gg</button></div>
                        <Link href="/privacy-policy" className='font-bold text-cyan-300'>Our Privacy Policy</Link>
                    </div>
                    <div className='space-y-2 text-xs sm:text-base'>
                        <h1 className='text-sm sm:text-lg'>Dota 2 Data Provided by:</h1>
                        <div className='flex sm:flex-col gap-2'>
                            <a href="https://www.stratz.com" target="_blank" className='text-cyan-200 flex items-center gap-1 hover:underline'>
                                <img src="/StratzLogo.svg" className='w-6 h-6'/> 
                                Stratz
                            </a>
                            <a href="https://www.opendota.com" target="_blank" className='text-cyan-200 flex items-center gap-1 hover:underline'>
                                <img src="/OpenDotaLogo.svg" className='w-6 h-6'/>
                                OpenDota
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}