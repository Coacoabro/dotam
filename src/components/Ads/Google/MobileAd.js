import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

export default function MobileAd({slot}) {

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
        <div className="flex sm:hidden fixed bottom-0 left-0 right-0 justify-center bg-slate-900/50 shadow-lg py-1 z-50 mx-auto">
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
                    width: "320px", 
                    height: "50px"
                }}
                data-ad-client="ca-pub-2521697717608899"
                data-ad-slot={slot}
            ></ins>
        </div>
    );
}
