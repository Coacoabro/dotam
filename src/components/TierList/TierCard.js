import React, { useState, useEffect } from 'react';


function TierCard(){
    return(
        <div className="flex space-x-1">
            <div className="px-8 rounded-md bg-gray-600">S</div>
            <div className="px-32 rounded-md bg-gray-600">Anti-Mage</div>
            <div className="px-8 rounded-md bg-gray-600">52%</div>
            <div className="px-8 rounded-md bg-gray-600">12%</div>
            <div className="px-8 rounded-md bg-gray-600">500</div>
            <div className="px-24 rounded-md bg-gray-600">Meepo PhantomLancer Spectre</div>
        </div>
    )
}

export default TierCard;