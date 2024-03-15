import React, { useState } from 'react';

import Matchup from './Matchup'

function MatchupContainer( {vs, heroes} ) {
    return(
        <div>
            {vs}
            <Matchup hero="hero"/>
        </div>
    )
}

export default MatchupContainer