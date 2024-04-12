import React, { useState } from 'react';

import Item from '../../Item'

function ItemOrder({early, core, late}) {

    
    return(
        <div className="rounded-md p-2 bg-gray-700 text-white text-lg space-y-3 w-64">
            <div>
                <h1>EARLY</h1>
                <div className="flex flex-wrap justify-evenly space-x-2 space-y-1">
                    {Array.isArray(early) ? early.map((item) => (
                        <Item id={item.Item} width="12" />
                    )) : "Not enough data"}
                </div>
            </div>
            <div>
                <h1>CORE</h1>
                <div className="flex flex-wrap justify-evenly space-x-2 space-y-1">
                    {Array.isArray(core) ? core.map((item) => (
                        <Item id={item.Item} width="12" />
                    )) : "Not enough data"}
                </div>
            </div>
            <div>
                <h1>LATE</h1>
                <div className="flex flex-wrap justify-evenly space-x-2 space-y-1">
                    {Array.isArray(late) ? late.map((item) => (
                        <Item id={item.Item} width="12" />
                    )) : "Not enough data"}
                </div>
            </div>
        </div>
    )
}

export default ItemOrder