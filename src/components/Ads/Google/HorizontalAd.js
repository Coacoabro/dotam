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
        <div className='flex items-center justify-center'>
            <Script 
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2521697717608899"
                crossOrigin='anonymous'
                strategy='afterInteractive'
            />

            <ins
                className='adsbygoogle'
                style={{
                    display: 'block',
                    width: '300px',
                    height: '150px'
                }}
                data-ad-client="ca-pub-2521697717608899"
                data-ad-slot="1909967797"
                data-ad-format="auto"
                data-full-width-responsive="true"
            >    
            </ins>
        </div>
    )
}