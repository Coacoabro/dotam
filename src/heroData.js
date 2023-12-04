export const fetchHeroWinRatesByRank = async (heroId) => {
  try {
    const apiUrl = `https://api.opendota.com/api/heroStats`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    const heroStats = data.find(hero => hero.id === heroId);

    if (heroStats) {
      const winRates = {};

      for (let i = 1; i <= 8; i++) {
        const pickKey = `${i}_pick`;
        const winKey = `${i}_win`;
        const pickCount = heroStats[pickKey] || 1; // Default to 1 if pick count is 0 to avoid division by zero
        const winCount = heroStats[winKey] || 0;

        const winRate = (winCount / pickCount) * 100; // Calculate win rate
        winRates[`Rank ${i}`] = winRate.toFixed(2); // Store win rate in the object with rank label
      }

      return winRates;
    } else {
      throw new Error('Hero not found.');
    }
  } catch (error) {
    console.error('Error fetching hero win rates by rank:', error);
    return null;
  }
};
