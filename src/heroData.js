const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiZWNmMWMxNTktMzk5Yy00N2UzLWEyMTktNzZkNjA5MDNmMGE5IiwiU3RlYW1JZCI6Ijk2MTcwMTk2IiwibmJmIjoxNzAxMTM0MDc5LCJleHAiOjE3MzI2NzAwNzksImlhdCI6MTcwMTEzNDA3OSwiaXNzIjoiaHR0cHM6Ly9hcGkuc3RyYXR6LmNvbSJ9.nSBddJPVGeufKvEq9DTkHq_pYaAp3i_-wUd8hv6WpGU'; // Replace with your API token from stratz.com

// Function to fetch hero data from the API
export const fetchHeroData = async () => {
  try {
    const apiUrl = 'https://api.stratz.com/api/v1/Hero';
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return null;
  }
};

// Function to fetch item data from the API
export const fetchItemData = async () => {
  try {
    const apiUrl = 'https://api.stratz.com/api/v1/Item';
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching item data:', error);
    return null;
  }
};

export const fetchMatchData = async () => {
  try {
    const apiUrl = 'https://api.stratz.com//api/v1/match/7461938625';
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching match data:', error);
    return null;
  }
};

// You can add more functions for different types of data you want to fetch
