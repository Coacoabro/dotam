import React, { useState } from 'react';

function ItemOrder({order, items}) {
    return(
        <div className="rounded-md p-2 bg-gray-600 text-white">
            <div className='text-center underline text-xl'>{order}</div>
            <div className="grid grid-cols-3 gap-2 text-center">
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

export default ItemOrder