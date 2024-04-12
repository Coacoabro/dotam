import React, { useState } from 'react';

function RateCard({type, rate}) {
    return(
        <div>
            <div className="text-center text-lg md:text-2xl text-white py-2">{rate}{ type === "Matches" ? "" : "%" } </div>
            <div className="text-center text-xs md:text-md align-bottom text-white">{type}</div>
        </div>
        
    );
}

export default RateCard;