import React, { useState } from 'react';

function BuildsContainer() {
  const [activeTab, setActiveTab] = useState('generic'); // State to track active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Update active tab when clicked
  };

  return (
    <div className="bg-gray-800">
      <div className="flex">
        {/* Tabs */}
        <div
          className={`tab ${activeTab === 'generic' ? 'active-tab' : ''}`}
          onClick={() => handleTabClick('generic')}
        >
          Generic Info
        </div>
        {/* Add more tabs for abilities, items, matchups */}
        {/* For example: */}
        <div
          className={`tab ${activeTab === 'abilities' ? 'active-tab' : ''}`}
          onClick={() => handleTabClick('abilities')}
        >
          Abilities
        </div>
        {/* ... Add other tabs similarly */}
      </div>
      {/* Display content based on active tab 
      {activeTab === 'generic' && <GenericInfo />}
      {activeTab === 'abilities' && <AbilityBuild />}
      */}
      {/* ... Add content for other tabs */}
    </div>
  );
};

export default BuildsContainer;
