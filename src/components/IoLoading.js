export default function IoLoading() {

    return(
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 py-4 opacity-75">
            <img src="/iopls.png" className={`w-24 animate-ping`}/>
        </div>
    )
}