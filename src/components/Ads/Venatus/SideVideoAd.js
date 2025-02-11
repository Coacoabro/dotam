import Ad from "./Ad"

export default function SideVideoAd( {ad} ){
    return(
        <div className='hidden xl-full:block fixed top-1/2 right-4'>
            <Ad placementName="video" />
        </div>
    )
}