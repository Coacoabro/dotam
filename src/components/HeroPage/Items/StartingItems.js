import React, { useState } from 'react';

function StartingItems() {
    return(
        <div>
            <div className='underline text-xl text-white'>STARTING ITEMS</div>
            <div className="grid grid-cols-3 gap-2 rounded-md p-2 bg-gray-600 text-white">
                <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
            </div>
        </div>
    )
}

export default StartingItems