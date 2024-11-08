import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

export default function BottomBarAd() {

    const router = useRouter()
    
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const adElement = document.querySelector('.adsbygoogle');
            
            if (adElement) {
                // Observe changes to detect when ad content loads
                const observer = new MutationObserver(() => {
                    if (adElement.offsetHeight > 0 && adElement.offsetWidth > 0) {
                        setAdLoaded(true);
                    }
                });
                
                observer.observe(adElement, { attributes: true, childList: true, subtree: true });
                
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.error("AdSense error: ", e);
                }
                
                // Clean up observer on unmount
                return () => observer.disconnect();
            }
        }
    }, []);

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
            {adLoaded && router.asPath !== "/" (
                <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-slate-900/50 shadow-lg">
                    <ins
                        className="adsbygoogle"
                        style={{ display: "inline-block", width: "728px", height: "90px" }}
                        data-ad-client="ca-pub-2521697717608899"
                        data-ad-slot="1909967797"
                    ></ins>
                </div>
            )}
        </div>
    );
}
