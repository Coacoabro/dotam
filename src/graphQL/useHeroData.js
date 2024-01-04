import { useState, useEffect } from 'react';



export function heroMatchCount(heroId) {
    const HERO_STATS = gql`
        query{
            heroStats{
                winGameVersion(heroIds: ${heroId}){
                    gameVersionId
                    winCount
                    matchCount
                }
            }
        }
    `;

    const [matchCount, setMatchCount] = useState(null);
    
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
            setMatchCount(winGameVersion.matchCount);
            }
        });
        }
    }, [data]);

    return matchCount;
}