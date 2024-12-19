Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default function Error({ statusCode }) {
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