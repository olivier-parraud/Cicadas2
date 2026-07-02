import { XMLParser } from 'fast-xml-parser';

const BGG_BASE_URL = 'https://boardgamegeek.com/xmlapi2';

// Configuration du parser XML en JSON
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true
});

/**
 * Effectue la requête HTTP vers l'API XML2 de BGG
 */
async function fetchBgg(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${BGG_BASE_URL}/${endpoint}?${queryParams}`;
    
    const headers = {};
    // Ajoute le token d'autorisation si configuré et non fictif
    if (process.env.BGG_API_KEY && process.env.BGG_API_KEY !== 'your_bgg_api_token') {
        headers['Authorization'] = `Bearer ${process.env.BGG_API_KEY}`;
    }
    
    console.log(`BGG Proxy: Fetching URL ${url}`);
    
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`BGG API returned status ${response.status}`);
    }
    
    const xmlData = await response.text();
    return xmlData;
}

/**
 * GET /api/bgg/search
 * Recherche de jeux par nom
 */
export const searchGames = async (req, res) => {
    try {
        const { query, type = 'boardgame', exact } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Le paramètre de recherche "query" est requis' });
        }
        
        const params = { query, type };
        if (exact !== undefined) {
            params.exact = exact; // '1' ou '0'
        }
        
        const xml = await fetchBgg('search', params);
        const json = parser.parse(xml);
        
        res.json(json);
    } catch (error) {
        console.error('Erreur proxy BGG search:', error);
        res.status(500).json({ error: error.message || 'Erreur lors de la recherche sur BGG' });
    }
};

/**
 * GET /api/bgg/thing
 * Récupération des détails d'un ou plusieurs jeux (séparés par des virgules)
 */
export const getGameDetails = async (req, res) => {
    try {
        const { id, stats } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'Le paramètre "id" (ex: id=13) est requis' });
        }
        
        const params = { id };
        if (stats !== undefined) {
            params.stats = stats; // '1' pour avoir les statistiques de note/classement
        }
        
        const xml = await fetchBgg('thing', params);
        const json = parser.parse(xml);
        
        res.json(json);
    } catch (error) {
        console.error('Erreur proxy BGG thing:', error);
        res.status(500).json({ error: error.message || 'Erreur lors de la récupération des détails sur BGG' });
    }
};
