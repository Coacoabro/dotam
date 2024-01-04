import React, { useState, useEffect } from 'react';
import RateCard from '@/components/RateCard';
import { useQuery, gql } from '@apollo/client';

function RatesContainer({ heroId , rank, role, totalMatches }) {

    const [heroWinRate, setHeroWinRate] = useState(null);
    const [heroPickRate, setHeroPickRate] = useState(null);
    const [heroMatches, setHeroMatches] = useState(null);

    const HERO_STATS = gql`
            query{
                heroStats {
                winGameVersion(
                    gameModeIds: ALL_PICK_RANKED
                    heroIds: ${heroId}
                    ${role ? `positionIds: ${role}` : ''}
                    ${rank ? `bracketIds: ${rank}` : ''}
                ) {
                    gameVersionId
                    winCount
                    matchCount
                }
                }
            }
        `;

    const { data } = useQuery(HERO_STATS);

    useEffect(() => {
        if (data) {
            let highestGameVersionId = 0;
            data.heroStats.winGameVersion.forEach((winGameVersion) => {
                if (winGameVersion.gameVersionId > highestGameVersionId) {
                    highestGameVersionId = winGameVersion.gameVersionId;
                }
            });
        
            data.heroStats.winGameVersion.forEach((winGameVersion) => {
                if (winGameVersion.gameVersionId === highestGameVersionId) {
                    setHeroMatches(winGameVersion.matchCount.toLocaleString());
                }
            });

            data.heroStats.winGameVersion.forEach((winGameVersion) => {
                if (winGameVersion.gameVersionId === highestGameVersionId) {
                    setHeroWinRate(((winGameVersion.winCount / winGameVersion.matchCount)*100).toFixed(2));
                }
            });

            setHeroPickRate(((data.heroStats.winGameVersion[0].matchCount / totalMatches)*100).toFixed(2));
        }
      }, [data]);

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
    )
}

export default RatesContainer;