import React, { useState } from 'react';

function RateCard({type, rate}) {
    return(
        <div>
            <div className="text-center text-2xl text-white py-2">{rate}%</div>
            <div className="text-center align-bottom text-white">{type}</div>
        </div>
        
    );
}

export default RateCard;