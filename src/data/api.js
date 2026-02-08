
const API_KEY = '3'; // Public test key
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

export const searchPlayers = async (query) => {
    if (!query || query.length < 2) return [];

    try {
        const response = await fetch(`${BASE_URL}/searchplayers.php?p=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        return data.player || [];
    } catch (error) {
        console.error('Error searching players:', error);
        return [];
    }
};
