import React, { useEffect } from 'react';
import { fetchHeroData, fetchItemData } from '../heroData'; // Adjust the import path based on your file structure

const TestComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const heroData = await fetchHeroData();
      console.log('Hero data:', heroData);

      const itemData = await fetchItemData();
      console.log('Item data:', itemData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Testing API Fetch</h1>
      {/* You can render fetched data here or perform further actions */}
    </div>
  );
};

export default TestComponent;
