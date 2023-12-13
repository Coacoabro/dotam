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
      let chosenPR = 50;
      let matches = 0;

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
        matches = tempPick
        
      } else if(currentRank === "Herald") {
        chosenWR = winRates["Rank 1"]
        matches = heroStats["1_pick"]
      } else if(currentRank === "Guardian") {
        chosenWR = winRates["Rank 2"]
        matches = heroStats["2_pick"]
      } else if(currentRank === "Crusader") {
        chosenWR = winRates["Rank 3"]
        matches = heroStats["3_pick"]
      } else if(currentRank === "Archon") {
        chosenWR = winRates["Rank 4"]
        matches = heroStats["4_pick"]
      } else if(currentRank === "Legend") {
        chosenWR = winRates["Rank 5"]
        matches = heroStats["5_pick"]
      } else if(currentRank === "Ancient") {
        chosenWR = winRates["Rank 6"]
        matches = heroStats["6_pick"]
      } else if(currentRank === "Divine") {
        chosenWR = winRates["Rank 7"]
        matches = heroStats["7_pick"]
      } else if(currentRank === "Immortal") {
        chosenWR = winRates["Rank 8"]
        matches = heroStats["8_pick"]
      }

      const winRate = parseFloat(chosenWR)
      const pickRate = parseFloat(chosenPR)

      return { winRate, matches };

    } else {
      throw new Error('Hero not found.');
    }
  } 
  
  catch (error) {
    console.error('Error fetching hero win rates by rank:', error);
    return null;
  }
};
