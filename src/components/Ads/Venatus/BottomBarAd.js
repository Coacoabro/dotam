import { useState } from 'react';

import Ad from "./Ad";

export default function BottomBarAd ({ ad }){

    const [viewAd, setViewAd] = useState(true)

    return(
        <div className={`${viewAd ? "" : "sm:hidden"} hidden sm:flex fixed bottom-0 left-0 right-0 justify-center items-center bg-slate-900/50 shadow-lg py-1 z-50 mx-auto max-h-[160px]`}>
            <Ad placementName="billboard" />
            <button className='w-12 h-12' onClick={()=>{setViewAd(false)}}>
                <img src="/cross.svg" className='text-cyan-200'/>
            </button>
        </div>
    )
}