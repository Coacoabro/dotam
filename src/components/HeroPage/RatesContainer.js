import React, { useState, useEffect } from 'react';
import RateCard from '@/components/HeroPage/RateCard';
import { useQuery, gql } from '@apollo/client';

function standardDeviation(arr) {
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b) / n;
    const deviation = Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
    return deviation
  }
  
function mean(arr) {
    return arr.reduce((a, b) => a + b) / arr.length;
    }

function TierCalc(score, PR) {
    let t
    if (PR <= 0.005) {
        t = '?'
    }
    else if(score > 3) {
        t = 'S+'
    }
    else if (score >= 2) {
        t = 'S'
    }
    else if (score >= 1) {
        t = 'A'
    }
    else if (score >= 0) {
        t = 'B'
    }
    else if (score >= -1) {
        t = 'C'
    }
    else if (score >= -2) {
        t = 'D'
    }
    else {
        t = 'F'
    }
    return t
}

function RatesContainer({ heroId , rank, role }) {

    const [heroWinRate, setHeroWinRate] = useState(null);
    const [heroPickRate, setHeroPickRate] = useState(null);
    const [heroMatches, setHeroMatches] = useState(null);
    const [totalMatches, setTotalMatches] = useState(0);
    const [heroTier, setHeroTier] = useState("?");
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
            let arrayWR = [];
            let arrayPR = [];

            if (infoChange) {

                data.heroStats.winMonth.forEach((winMonth) => {
                    if (winMonth.month > highestMonth) {
                        highestMonth = winMonth.month;
                    }
                });
                
                data.heroStats.winMonth.forEach((winMonth) => {
                    if (winMonth.month === highestMonth) {
                      total += winMonth.matchCount;
                      arrayWR.push(winMonth.winCount/winMonth.matchCount);
                    }
                  });

                
                let finalTotal = total/10;

                if (role) {
                    finalTotal *= 5;
                }

                if (finalTotal !== 0) {

                    data.heroStats.winMonth.forEach((winMonth) => {
                        if (winMonth.month === highestMonth) {
                            arrayPR.push(winMonth.matchCount/finalTotal)
                        }
                    });

                

                    data.heroStats.winMonth.forEach((winMonth) => {

                        if (winMonth.month === highestMonth && winMonth.heroId === heroId) {
                            setHeroWinRate(((winMonth.winCount / winMonth.matchCount)*100).toFixed(2));
                            setHeroMatches(winMonth.matchCount.toLocaleString());
                            setHeroPickRate(((winMonth.matchCount / finalTotal)*100).toFixed(2));
                            setTotalMatches(finalTotal/10);
    
                            const sdWR = standardDeviation(arrayWR)
                            const sdPR = standardDeviation(arrayPR)
                            const zScoreWR = ((winMonth.winCount / winMonth.matchCount) - mean(arrayWR)) / sdWR;
                            const zScorePR = ((winMonth.matchCount / finalTotal) - mean(arrayPR)) / sdPR;
                            console.log(zScoreWR, zScorePR)
    
                            let score;
                            if (zScoreWR < 0) {
                                score = zScoreWR - zScorePR;
                            } else {
                                score = zScoreWR + zScorePR;
                            }

                            setHeroTier(TierCalc(score, (winMonth.matchCount / finalTotal)))
                            

                        }
                    });


                    setInfoChange(false);

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
        
}

export default RatesContainer;