import React, { useState } from 'react';

import Item from '../../Item'

function ItemOrder({early, core, late}) {

    
    return(
        <div className="rounded-md py-2 px-4 bg-gray-700 text-white text-lg space-y-3 md:w-96 w-64">
            <div>
                <h1>EARLY</h1>
                <div className="grid md:grid-cols-3 gap-2 grid-cols-3">
                    {Array.isArray(early) ? early.map((item) => (
                        <Item id={item.Item} width="12" wr={item.WR} pr={item.PR} matches={item.Matches} time={item.Time} />
                    )) : "Not enough data"}
                </div>
            </div>
            <div>
                <h1>CORE</h1>
                <div className="grid md:grid-cols-3 gap-2 grid-cols-3">
                    {Array.isArray(core) ? core.map((item) => (
                        <Item id={item.Item} width="12" wr={item.WR} pr={item.PR} matches={item.Matches} time={item.Time} />
                    )) : "Not enough data"}
                </div>
            </div>
        </div>
    )
}

export default ItemOrder