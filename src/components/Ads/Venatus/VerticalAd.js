import Ad from "./Ad";

export default function VerticalAd ({ ad }){
    return(
        <div className='hidden xl-full:block fixed top-1/4 left-4'>
            <Ad placementName="skyscraper" />
        </div>
    )
}