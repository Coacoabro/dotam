import { useEffect } from "react"

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default function Error({ statusCode }) {

    useEffect(() => {
        const hasRefreshed = sessionStorage.getItem('hasRefreshed')
        if (!hasRefreshed) {
            sessionStorage.setItem('hasRefreshed', 'true')
            location.reload()
        } else {
            sessionStorage.removeItem('hasRefreshed') // Clean up for next error
        }
    }, [])

    return(
        <div className="flex flex-col items-center justify-center min-h-screen text-xl">
            <div className="font-bold flex gap-2 items-center">
                <button onClick={() => location.reload()}>
                    <img src="https://media.tenor.com/oermsW18ccEAAAAj/io-dota.gif" />
                </button>
                An error has occured! Status Code: {statusCode} 
            </div>
            <div className="text-center">
                Click the scared Io to refresh the page!
            </div>
        </div>
    )
}