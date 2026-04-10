import React, { useState, useEffect } from 'react';

export default function RateCard({type, rate}) {

    const [color, setColor] = useState("text-slate-200")

    useEffect(() => {
        if(type == "Win Rate" || type == "Tier"){
            if(rate > 55 || rate == "S+") {
                setColor("text-[#F4B856]")
            }
            else if (rate > 52.5 || rate == "S") {
                setColor("text-[#7879DE]")
            }
            else if (rate > 51.5 || rate == "A") {
                setColor("text-[#ABDEED]")
            }
            else if (rate > 48.5 || rate == "B") {
                setColor("text-slate-200")
            }
            else if (rate > 47.5 || rate == "C") {
                setColor("text-[#FCA5A5]")
            }
            else if (rate == "D") {
                setColor("text-[#F46E58]")
            }
            else{
                setColor("text-[#F46E58]")
            }
        }
        else{
            setColor("text-slate-200")
        }
    }, [type, rate])

    return(
        <div className='flex gap-2 items-center'>
            <span className={`text-sm opacity-75`}>{type}</span>
            <span className={`${color} font-bold text-[16px]/[24px]`}>{rate}{ type === "Win Rate" || type === "Pick Rate" ? "%" : "" } </span>
        </div>
        
        
    );
}
