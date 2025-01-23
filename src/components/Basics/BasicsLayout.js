import Link from "next/link"
import { useEffect, useState } from "react"
import Navigation from "./Navigation"
import OnThisPage from "./OnThisPage"
import { useRouter } from "next/router"
import Head from "next/head"

export default function BasicsLayout({children, headings}){

    const router = useRouter()

    const [mobileNav, setMobileNav] = useState(false)

    useEffect(()=>{
        setMobileNav(false)
    }, [router])

    return(
        <div>
            <Head>
                <title>Basics: {headings[0] ? headings[0].text : ''}</title>
                <meta name="google-adsense-account"
                    content="ca-pub-2521697717608899" />
                <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899" crossorigin="anonymous"></script>
            </Head>
            {/* Desktop Version */}
            <div className="hidden sm:flex space-x-4 mt-8 h-[calc(100vh-160px)]">
                <div className="w-1/6"><Navigation /></div>
                <div className="w-2/3 basics p-4 max-h-screen overflow-y-auto custom-scrollbar">
                    {children}
                </div>
                <div className=""><OnThisPage headings={headings} /></div>
            </div>

            {/* Mobile Version */}
            <div className="sm:hidden">
                <button
                    onClick={()=>setMobileNav(!mobileNav)}
                    className="px-4"
                >
                    <img src='/burger-menu.svg' className="w-8 absolute top-16 py-4" />
                </button>
                <div className="basics p-4 max-h-screen overflow-y-auto custom-scrollbar">
                    {children}
                </div>
                <div className={`${mobileNav ? 'w-64' : 'w-0'} absolute flex top-28 z-20 overflow-hidden transition-all duration-300 delay-50 ease-in-out bg-slate-900`}>
                    <Navigation />
                </div>
            </div>
        </div>

    )
}