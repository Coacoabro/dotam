import React, { useState } from 'react';
import MatchupContainer from './MatchupContainer';

function MatchupsInfo() {

    return(
        <div className="bg-gray-500 p-3 flex justify-evenly text-white">
            <MatchupContainer vs="Best Against" heroes="list"/>
            <MatchupContainer vs="Worst Against" heroes="list"/>
            <MatchupContainer vs="Best With" heroes="list"/>
            <MatchupContainer vs="Worst With" heroes="list"/>
        </div>
        
    );

}

export default MatchupsInfo;