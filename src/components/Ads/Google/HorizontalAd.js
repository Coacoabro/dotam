import Script from 'next/script'
import { useEffect } from 'react'

export default function HorizontalAd(){

    useEffect(() => {
        if (typeof window !== 'undefined'){
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (e) {
                console.error("AdSense error: ", e)
            }
        }
    }, [])

    return(
        <div className='flex items-center justify-center mx-auto'>
            <Script 
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899"
                crossOrigin='anonymous'
                strategy='afterInteractive'
            />

            <ins class="adsbygoogle"
                style="display:inline-block;width:728px;height:90px"
                data-ad-client="ca-pub-2521697717608899"
                data-ad-slot="1909967797"
            ></ins>
        </div>
    )
}