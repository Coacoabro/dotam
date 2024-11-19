import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

export default function BottomBarAd({slot}) {

    const [viewAd, setViewAd] = useState(true)

    useEffect(() => {
        if (typeof window !== 'undefined'){
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (e) {
                console.error("AdSense error: ", e)
            }
        }
    }, [])

    return (
        <>
            <div className={`${viewAd ? "" : "sm:hidden"} hidden sm:flex fixed bottom-0 left-0 right-0 justify-center items-center bg-slate-900/50 shadow-lg py-1 z-50 mx-auto`}>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
                <ins
                    className="adsbygoogle"
                    style={{ 
                        display: "inline-block", 
                        width: "728px", 
                        height: "90px"
                    }}
                    data-ad-client="ca-pub-2521697717608899"
                    data-ad-slot={slot}
                ></ins>
                <button 
                    className='w-12 h-12'
                    onClick={()=>{setViewAd(false)}}
                >
                    <img src="/cross.svg" className='text-cyan-200'/>
                </button>
            </div>
        </>
    );
}
