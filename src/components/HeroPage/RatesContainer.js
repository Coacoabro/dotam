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
        <div className="flex md:px-20 py-5 justify-between">

            <div className="p-2 md:w-24 md:h-24 rounded-md bg-gray-700">
                <div className="text-center text-xl md:text-2xl text-white py-2">{heroTier}</div>
                <div className="text-center text-xs md:text-md align-bottom text-white">Tier</div>
            </div>

            <div className="p-2 md:w-24 md:h-24 rounded-md bg-gray-700">
                <RateCard type="Win Rate" rate={heroWinRate} />
            </div>

            <div className="p-2 md:w-24 md:h-24 rounded-md bg-gray-700">
                <RateCard type="Pick Rate" rate={heroPickRate} />
            </div>

            <div className="p-2 md:w-36 md:h-24 rounded-md bg-gray-700">
                <RateCard type="Matches" rate={heroMatches} />
            </div>
            
        </div>
    );
    }
        

export default RatesContainer;