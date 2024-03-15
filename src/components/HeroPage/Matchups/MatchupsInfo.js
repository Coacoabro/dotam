import React, { useState } from 'react';
import MatchupContainer from './MatchupContainer';

function MatchupsInfo() {

    return(
        <div className="bg-gray-500 p-3 flex justify-evenly">
            <MatchupContainer vs="best-against" heroes="list"/>
            <MatchupContainer vs="worst-against" heroes="list"/>
            <MatchupContainer vs="best-with" heroes="list"/>
            <MatchupContainer vs="worst-with" heroes="list"/>
        </div>
        
    );

}

export default MatchupsInfo;