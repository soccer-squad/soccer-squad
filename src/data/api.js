
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

export const fetchWikiBio = async (playerName) => {
    try {
        // Use Wikipedia Text Extract API
        // First try full name
        let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(playerName.replace(/ /g, '_'))}`;
        let response = await fetch(url);

        if (!response.ok) {
            // Try adding "(footballer)" to query
            url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(playerName.replace(/ /g, '_'))}_(footballer)`;
            response = await fetch(url);
        }

        if (!response.ok) return null;

        const data = await response.json();
        return data.extract || null;
    } catch (err) {
        console.error('Wiki fetch failed:', err);
        return null;
    }
};
