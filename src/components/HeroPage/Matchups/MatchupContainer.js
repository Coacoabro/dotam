import React, { useState } from 'react';

import Matchup from './Matchup'

function MatchupContainer( {vs, heroes} ) {
    return(
        <div className="bg-gray-600 p-3 rounded-md">
            {vs}
            <Matchup hero="hero"/>
        </div>
    )
}

export default MatchupContainer