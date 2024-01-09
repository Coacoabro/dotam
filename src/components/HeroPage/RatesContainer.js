import React, { useState, useEffect } from 'react';
import RateCard from '@/components/HeroPage/RateCard';
import { useQuery, gql } from '@apollo/client';

function RatesContainer({ heroId , rank, role }) {

    const [heroWinRate, setHeroWinRate] = useState(null);
    const [heroPickRate, setHeroPickRate] = useState(null);
    const [heroMatches, setHeroMatches] = useState(null);
    const [totalMatches, setTotalMatches] = useState(0);
    const [prevTotalMatches, setPrevTotalMatches] = useState(0);

    const [infoChange, setInfoChange] = useState(true);   

    useEffect(() => {
        setInfoChange(true);
    }, [rank, role]);

    const HERO_STATS = gql`
            query{
                heroStats {
                winMonth(
                    gameModeIds: ALL_PICK_RANKED
                    ${role ? `positionIds: ${role}` : ''}
                    ${rank ? `bracketIds: ${rank}` : ''}
                ) {
                    month
                    winCount
                    matchCount
                    heroId
                }
                }
            }
        `;

    const { data } = useQuery(HERO_STATS);

    useEffect(() => {
        if (data) {

            let highestMonth = 0;
            let total = 0;

            if (infoChange) {

                data.heroStats.winMonth.forEach((winMonth) => {
                    if (winMonth.month > highestMonth) {
                        highestMonth = winMonth.month;
                    }
                });
                
                data.heroStats.winMonth.forEach((winMonth) => {
                    if (winMonth.month === highestMonth) {
                      total += winMonth.matchCount;
                    }
                  });
                
                let finalTotal = total/10;

                if (role) {
                    finalTotal *= 5;
                }

                if (finalTotal !== prevTotalMatches && finalTotal !== 0) {

                    data.heroStats.winMonth.forEach((winMonth) => {
                        if (winMonth.month === highestMonth && winMonth.heroId === heroId) {
                            setHeroWinRate(((winMonth.winCount / winMonth.matchCount)*100).toFixed(2));
                            setHeroMatches(winMonth.matchCount.toLocaleString());
                            setHeroPickRate(((winMonth.matchCount / finalTotal)*100).toFixed(2));
                            setTotalMatches(finalTotal/10);
                        }
                    });

                    setInfoChange(false);
                    setPrevTotalMatches(totalMatches);

                }
                
            }
        
            
            
        }
      }, [data]);

    
      if(totalMatches === 0) {
        return
      }
      else {
        return (
            <div className="flex px-20 py-5 justify-between">

                <div className="w-24 h-24 rounded-md border-4">
                    <div className="text-center text-2xl text-white py-2">S</div>
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
        
}

export default RatesContainer;