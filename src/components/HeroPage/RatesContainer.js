import React, { useState, useEffect } from 'react';
import RateCard from '../HeroPage/RateCard';

function RatesContainer({ rates, rank, role }) {

    const [heroWinRate, setHeroWinRate] = useState(0);
    const [heroPickRate, setHeroPickRate] = useState(0);
    const [heroMatches, setHeroMatches] = useState(0);
    const [heroTier, setHeroTier] = useState(0);

    useEffect(() => {

        const rate = rates.find(r => r.rank === rank && r.role === role)

        if (rate) {
            setHeroWinRate((rate.winrate * 100).toFixed(2));
            setHeroPickRate((rate.pickrate * 100).toFixed(2));
            setHeroMatches(rate.matches.toLocaleString());
            setHeroTier(rate.tier_str);
        }
    
    }, [{rates, rank, role}])



    
    return (
        <div className="flex px-20 py-5 justify-between">

            <div className="w-24 h-24 rounded-md border-4">
                <div className="text-center text-2xl text-white py-2">{heroTier}</div>
                <div className="text-center align-bottom text-white">Tier</div>
            </div>

            <div className="w-24 h-24 rounded-md border-4">
                <RateCard type="Win Rate" rate={heroWinRate} />
            </div>

            <div className="w-24 h-24 rounded-md border-4">
                <RateCard type="Pick Rate" rate={heroPickRate} />
            </div>

            <div className="w-36 h-24 rounded-md border-4">
                <RateCard type="Matches" rate={heroMatches} />
            </div>
            
        </div>
    );
    }
        

export default RatesContainer;