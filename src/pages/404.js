import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Io404() {
    const router = useRouter()

    useEffect(() => {
        const hasRetried = sessionStorage.getItem('hasRetried')

        if (!hasRetried) {
            sessionStorage.setItem('hasRetried', 'true')
            router.reload()
        } else {
            console.error('Page not found or has an error')
        }
    }, [router])

    return(
        <div className="flex flex-col items-center justify-center min-h-screen text-xl">
            <div className="font-bold flex gap-2 items-center">
                <img src="https://media.tenor.com/oermsW18ccEAAAAj/io-dota.gif" />
                404 - Page not found
            </div>
            <div>This could be an error on the page or it doesn't exist</div>
        </div>
    )
}