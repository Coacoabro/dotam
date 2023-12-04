// Function to fetch hero data from the OpenDota API
export const fetchHeroData = async () => {
  try {
    const apiUrl = 'https://api.opendota.com/api/heroes';
    const response = await fetch(apiUrl);

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

// Function to fetch item data from the OpenDota API
export const fetchItemData = async () => {
  try {
    const apiUrl = 'https://api.opendota.com/api/items';
    const response = await fetch(apiUrl);

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

// You can add more functions for different types of data you want to fetch
