import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

export default function BottomBarAd() {

    const router = useRouter()
    
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
        <div>
            {/* Load AdSense script */}
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />

            {/* Conditionally render the ad if loaded */}
            {router.asPath !== "/" ? (
                <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-slate-900/50 shadow-lg py-4">
                    <ins
                        className="adsbygoogle"
                        style={{ display: "inline-block", width: "728px", height: "90px" }}
                        data-ad-client="ca-pub-2521697717608899"
                        data-ad-slot="2221793137"
                    ></ins>
                </div>
            ) : null}
        </div>
    );
}
