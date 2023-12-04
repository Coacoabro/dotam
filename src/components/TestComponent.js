import React, { useEffect } from 'react';
import { fetchHeroWinRatesByRank } from '../heroData'; // Adjust the import path based on your file structure

const TestComponent = ({id, name}) => {

  

  useEffect(() => {
    const fetchData = async () => {
      fetchHeroWinRatesByRank(id)
      .then(winRates => {
        console.log(winRates["Rank 1"])
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>{name} win rate is: {}</h1>
    </div>
  );
};

export default TestComponent;
