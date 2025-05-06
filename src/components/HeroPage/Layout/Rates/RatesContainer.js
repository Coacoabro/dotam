import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RateCard from './RateCard';


export default function RatesContainer({ rates }) {

    const tierColor = {
        "S+": "text-[#F4B856]", 
        "S": "text-[#7879DE]", 
        "A": "text-[#ABDEED]", 
        "B": "text-slate-200", 
        "C": "text-[#FCA5A5]", 
        "D": "text-[#F46E58]", 
        "F": "text-[#E8624C]"
    }

    
    const [currRate, setCurrRate] = useState(rates)
    const [heroWinRate, setHeroWinRate] = useState((currRate.winrate * 100).toFixed(2));
    const [heroPickRate, setHeroPickRate] = useState((currRate.pickrate * 100).toFixed(2));
    const [heroMatches, setHeroMatches] = useState(currRate.matches.toLocaleString());
    const [heroTier, setHeroTier] = useState(currRate.tier_str);
    const [color, setColor] = useState(tierColor[heroTier])

    useEffect(() => {

        if (rates) {
            setCurrRate(rates)
            setHeroWinRate((rates.winrate * 100).toFixed(2));
            setHeroPickRate((rates.pickrate * 100).toFixed(2));
            setHeroMatches(rates.matches.toLocaleString());
            setHeroTier(rates.tier_str);
        }

        setColor(tierColor[heroTier])
    
    }, [rates])



    
    return (
        <div className="flex mx-2 sm:mx-0 py-2 sm:py-0 sm:gap-1 text-slate-200 space-x-1">

            <div className="w-14 h-16 sm:w-20 sm:h-20 rounded-md bg-slate-800 border border-slate-700">
                <div className={`text-center text-xl md:text-2xl ${color} py-1 sm:py-2`}>{heroTier}</div>
                <div className="text-center text-sm md:text-md align-bottom text-cyan-300">Tier</div>
            </div>

            <div className="w-20 sm:w-28 sm:h-20 rounded-md bg-slate-800 border border-slate-700">
                <RateCard type="Win Rate" rate={heroWinRate} />
            </div>

            <div className="w-20 sm:w-28 sm:h-20 rounded-md bg-slate-800 border border-slate-700">
                <RateCard type="Pick Rate" rate={heroPickRate} />
            </div>

            <div className="w-28 sm:w-36 sm:h-20 rounded-md bg-slate-800 border border-slate-700">
                <RateCard type="Matches" rate={heroMatches} />
            </div>
            
        </div>
    );
}
        