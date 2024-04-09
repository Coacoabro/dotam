import React, { useState, useEffect } from 'react';
import MatchupContainer from './MatchupContainer';

function MatchupsInfo( {heroID, matchups} ) {

    const [matchupList, setMatchupList] = useState([])

    useEffect(() => {
        if(matchups){
            setMatchupList(matchups)
        }
    }, [matchups])

    const bestag = matchups.herovs
    const worstag = [...bestag].reverse()
    const bestwi = matchups.herowith
    const worstwi = [...bestwi].reverse()

    return(
        <div className="bg-gray-500 p-3 flex justify-evenly text-white rounded-tr-md rounded-b-md">
            <MatchupContainer vs="BEST AGAINST" heroes={bestag} />
            <MatchupContainer vs="WORST AGAINST" heroes={worstag} />
            <MatchupContainer vs="BEST WITH" heroes={bestwi} />
            <MatchupContainer vs="WORST WITH" heroes={worstwi} />
        </div>
        
    );

}

export default MatchupsInfo;