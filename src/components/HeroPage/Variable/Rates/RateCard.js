import React, { useState, useEffect } from 'react';

export default function RateCard({type, rate}) {

    const [color, setColor] = useState("text-slate-200")

    useEffect(() => {
        if(type == "Win Rate"){
            if(rate > 55) {
                setColor("text-[#F4B856]")
            }
            else if (rate > 52.5) {
                setColor("text-[#7879DE]")
            }
            else if (rate > 51.5) {
                setColor("text-[#ABDEED]")
            }
            else if (rate > 48.5) {
                setColor("text-slate-200")
            }
            else if (rate > 47.5) {
                setColor("text-[#FCA5A5]")
            }
            else{
                setColor("text-[#F46E58]")
            }
        }
    }, [type, rate])

    return(
        <div className='sm:space-y-0'>
            <div className={`text-center text-lg font-medium md:text-2xl ${color} py-1 sm:py-2`}>{rate}{ type === "Matches" ? "" : "%" } </div>
            <div className="text-center text-sm md:text-md align-bottom text-slate-200/50">{type}</div>
        </div>
        
    );
}
