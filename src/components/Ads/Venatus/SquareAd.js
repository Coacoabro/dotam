import Ad from "./Ad"

export default function SquareAd( {ad} ){
    return(
        <div className='hidden xl-full:block fixed top-1/4 right-4'>
            <Ad placementName="mpu" />
        </div>
    )
}