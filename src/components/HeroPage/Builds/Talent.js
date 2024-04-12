import React, { useState, useEffect } from 'react';

const Talent = ({level, talent, PR}) => {
    return (
        <div className={`flex items-center justify-between space-x-2 p-1`}>
            <h1 className="rounded-md text-xl">{level}:</h1>
            <h2>{talent}</h2>
            <h3 className="text-sm">{PR==="100.00" ? "100" : PR}%</h3>
        </div>
    )
}

export default Talent;