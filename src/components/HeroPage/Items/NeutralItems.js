import React from 'react';
import { useState } from 'react';

function NeutralItems({tier, items}) {

    return(
        <div className='bg-gray-600 text-white p-3 rounded-md'>
            <div className="underline">TIER {tier}</div>
            <div className="grid grid-cols-3 gap-2">
                <div>ITEM</div>
                <div>WIN</div>
                <div>PICK</div>
                <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <div>60%</div>
                <div>52%</div>
                <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <div>30%</div>
                <div>52%</div>
                <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <div>10%</div>
                <div>52%</div>
            </div>
        </div>
    )

}

export default NeutralItems;