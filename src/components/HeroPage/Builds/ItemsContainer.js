import React from 'react';

function ItemsContainer() {
    return (
        <div className="flex justify-between px-4">
            <div className="rounded-md p-2 bg-gray-600 text-white">
                STARTING ITEMS
                <div className="grid grid-cols-3 gap-2">
                    <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <img className="w-8"src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                </div>
            </div>
            <div className="rounded-md p-2 bg-gray-500 text-white">
                1ST ITEM
                <div className="grid grid-cols-2 gap-2">
                    <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <div>PR: 60%</div>
                    <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <div>PR: 40%</div>
                </div>
            </div>
            <div className="rounded-md p-2 bg-gray-600 text-white">
                2nd Item
                <div className="grid grid-cols-2 gap-2">
                    <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <div>PR: 60%</div>
                    <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <div>PR: 40%</div>
                </div>
            </div>
            <div className="rounded-md p-2 bg-gray-500 text-white">
                3rd Item
                <div className="grid grid-cols-2 gap-2">
                    <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <div>PR: 60%</div>
                    <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <div>PR: 40%</div>
                </div>
            </div>
            <div className="rounded-md p-2 bg-gray-600 text-white">
                4th Item
                <div className="grid grid-cols-2 gap-2">
                    <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <div>PR: 60%</div>
                    <img className="w-8" src="https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png" alt="tango"/>
                    <div>PR: 40%</div>
                </div>
            </div>
        </div>
    )
}

export default ItemsContainer;