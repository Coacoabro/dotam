import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RateCard from './RateCard';


export default function RatesContainer({ rates, onSendData }) {

    const tierColor = {
        "S+": "text-[#F4B856]", 
        "S": "text-[#7879DE]", 
        "A": "text-[#ABDEED]", 
        "B": "text-slate-200", 
        "C": "text-[#FCA5A5]", 
        "D": "text-[#F46E58]", 
        "F": "text-[#E8624C]"
    }

    
    const [heroWinRate, setHeroWinRate] = useState(null)
    const [heroPickRate, setHeroPickRate] = useState(null)
    const [heroMatches, setHeroMatches] = useState(null)
    const [heroTier, setHeroTier] = useState(null)
    const [color, setColor] = useState(null)

    useEffect(() => {

        if (rates) {
            setHeroWinRate((rates.winrate * 100).toFixed(2));
            setHeroPickRate((rates.pickrate * 100).toFixed(2));
            setHeroMatches(rates.matches.toLocaleString());
            setHeroTier(rates.tier_str);
            setColor(tierColor[rates.tier_str])
        }
    
    }, [rates])


    
    return (
        <div className="flex sm:gap-[24px] text-slate-200 space-x-1 items-end ml-1 h-[32px]">

            <div className={`py-2 px-[10px] rounded-md text-[20px]/[20px] font-semibold bg-[#FFFFFF14] ${color}`}>
                {heroTier}
            </div>

            <RateCard type="Win Rate" rate={heroWinRate} />

            <RateCard type="Pick Rate" rate={heroPickRate} />

            <RateCard type="Matches" rate={heroMatches} />
            
        </div>
    );
}
        