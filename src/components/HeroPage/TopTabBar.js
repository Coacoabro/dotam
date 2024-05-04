import React, { useState } from 'react';

function TopTabBar({activeTab, setActiveTab}) {

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
      };

    return (
        <div className="flex space-x-12">
          <div
            className={`cursor-pointer px-4 py-2 rounded-t-md ${
              activeTab === 0 ? 'bg-gray-500 text-white' : 'bg-gray-400 text-gray-700'
            }`}
            onClick={() => handleTabClick(0)}
          >
            Builds
          </div>
          <div
            className={`cursor-pointer px-4 py-2 rounded-t-md ${
              activeTab === 1 ? 'bg-gray-500 text-white' : 'bg-gray-400 text-gray-700'
            }`}
            onClick={() => handleTabClick(1)}
          >
            Items
          </div>
          {/* <div
            className={`cursor-pointer px-4 py-2 rounded-t-md ${
              activeTab === 2 ? 'bg-gray-500 text-white' : 'bg-gray-400 text-gray-700'
            }`}
            onClick={() => handleTabClick(2)}
          >
            Abilities
          </div> */}
          <div
            className={`cursor-pointer px-4 py-2 rounded-t-md ${
              activeTab === 3 ? 'bg-gray-500 text-white' : 'bg-gray-400 text-gray-700'
            }`}
            onClick={() => handleTabClick(3)}
          >
            Matchups
          </div>

          
        </div>
      );
}

export default TopTabBar;