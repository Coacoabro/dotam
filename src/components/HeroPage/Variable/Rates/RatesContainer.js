import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RateCard from './RateCard';

export default function RatesContainer({ rates, initRole }) {

    const router = useRouter()

    const tierColor = {"S+": "text-yellow-400", "S": "text-indigo-600", "A": "text-indigo-300", "B": "text-white", "C": "text-red-100", "D": "text-red-300", "F": "text-red-700"}

    
    const [heroWinRate, setHeroWinRate] = useState(0);
    const [heroPickRate, setHeroPickRate] = useState(0);
    const [heroMatches, setHeroMatches] = useState(0);
    const [heroTier, setHeroTier] = useState(0);

    const [color, setColor] = useState(tierColor[heroTier])

    useEffect(() => {

        let { rank, role } = router.query
        if (!role) {role = initRole}
        if (!rank) {rank = ""}

        const rate = rates.find(r => r.rank === rank && r.role === role)

        if (rate) {
            setHeroWinRate((rate.winrate * 100).toFixed(2));
            setHeroPickRate((rate.pickrate * 100).toFixed(2));
            setHeroMatches(rate.matches.toLocaleString());
            setHeroTier(rate.tier_str);
        }

        setColor(tierColor[heroTier])
    
    }, [{rates} , router.events, initRole])



    
    return (
        <div className="flex mx-4 gap-1 text-slate-200">

            <div className="md:w-20 md:h-20 rounded-md bg-slate-800 border-2 border-slate-900">
                <div className={`text-center text-xl md:text-2xl ${color} py-2`}>{heroTier}</div>
                <div className="text-center text-sm md:text-md align-bottom text-white">Tier</div>
            </div>

            <div className="md:w-28 md:h-20 rounded-md bg-slate-800 border-2 border-slate-900">
                <RateCard type="Win Rate" rate={heroWinRate} />
            </div>

            <div className="md:w-28 md:h-20 rounded-md bg-slate-800 border-2 border-slate-900">
                <RateCard type="Pick Rate" rate={heroPickRate} />
            </div>

            <div className="md:w-36 md:h-20 rounded-md bg-slate-800 border-2 border-slate-900">
                <RateCard type="Matches" rate={heroMatches} />
            </div>
            
        </div>
    );
}
        