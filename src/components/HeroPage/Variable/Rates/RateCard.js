import React, { useState, useEffect } from 'react';

export default function RateCard({type, rate}) {

    const [color, setColor] = useState("text-slate-200")

    useEffect(() => {
        if(type == "Win Rate"){
            if(rate > 55) {
                setColor("text-yellow-400")
            }
            else if (rate > 52.5) {
                setColor("text-indigo-600")
            }
            else if (rate > 50.5) {
                setColor("text-indigo-300")
            }
            else if (rate > 49.5) {
                setColor("text-slate-200")
            }
            else if (rate > 47.5) {
                setColor("text-red-300")
            }
            else{
                setColor("text-red-700")
            }
        }
    }, [type, rate])

    return(
        <div>
            <div className={`text-center text-lg md:text-2xl ${color} py-2`}>{rate}{ type === "Matches" ? "" : "%" } </div>
            <div className="text-center text-sm md:text-md align-bottom text-white">{type}</div>
        </div>
        
    );
}
