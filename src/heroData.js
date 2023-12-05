export const fetchHeroWinRatesByRank = async ({heroID, currentRank}) => {
  try {
    const apiUrl = `https://api.opendota.com/api/heroStats`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    const heroStats = data.find(hero => hero.id === heroID);


    
    if (heroStats) {
      const winRates = {};
      let chosenWR = 0;

      for (let i = 1; i <= 8; i++) {
        const pickKey = `${i}_pick`;
        const winKey = `${i}_win`;
        const pickCount = heroStats[pickKey] || 1; // Default to 1 if pick count is 0 to avoid division by zero
        const winCount = heroStats[winKey] || 0;

        const winRate = (winCount / pickCount) * 100; // Calculate win rate
        winRates[`Rank ${i}`] = winRate.toFixed(2); // Store win rate in the object with rank label
      }

      if(currentRank === "All") {
        
        let tempWin = 0
        let tempPick = 0
        for (let i=1; i<=8; i++){
          tempWin += parseFloat(heroStats[`${i}_win`])
          tempPick += parseFloat(heroStats[`${i}_pick`])
        }
        chosenWR = ((tempWin/tempPick)*100).toFixed(2)
        
      } else if(currentRank === "Herald") {
        chosenWR = winRates["Rank 1"]
      } else if(currentRank === "Guardian") {
        chosenWR = winRates["Rank 2"]
      } else if(currentRank === "Crusader") {
        chosenWR = winRates["Rank 3"]
      } else if(currentRank === "Archon") {
        chosenWR = winRates["Rank 4"]
      } else if(currentRank === "Legend") {
        chosenWR = winRates["Rank 5"]
      } else if(currentRank === "Ancient") {
        chosenWR = winRates["Rank 6"]
      } else if(currentRank === "Divine") {
        chosenWR = winRates["Rank 7"]
      } else if(currentRank === "Immortal") {
        chosenWR = winRates["Rank 8"]
      }

      return chosenWR;
    } else {
      throw new Error('Hero not found.');
    }
  } 
  
  catch (error) {
    console.error('Error fetching hero win rates by rank:', error);
    return null;
  }
};


