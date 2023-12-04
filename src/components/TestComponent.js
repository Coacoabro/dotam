import React, { useEffect } from 'react';
import { fetchHeroWinRatesByRank } from '../heroData'; // Adjust the import path based on your file structure

const TestComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      fetchHeroWinRatesByRank(1)
      .then(winRates => {
        console.log('Win rates by rank for Anti-Mage:', winRates);
      })
      .catch(error => {
        console.error('Error:', error);
      });
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
