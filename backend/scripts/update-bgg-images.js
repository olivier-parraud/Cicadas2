import 'dotenv/config';
import { XMLParser } from 'fast-xml-parser';
import { query } from '../src/config/db.js';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true
});

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchBgg(url, retryCount = 0) {
    const headers = {};
    if (process.env.BGG_API_KEY && process.env.BGG_API_KEY !== 'your_bgg_api_token') {
        headers['Authorization'] = `Bearer ${process.env.BGG_API_KEY}`;
    }
    
    try {
        let res = await fetch(url, { headers });
        
        // Handle rate limiting (429) or service temp down (503/504)
        if ((res.status === 429 || res.status === 503 || res.status === 502) && retryCount < 5) {
            const waitTime = (retryCount + 1) * 2000;
            console.log(`[Rate Limit / Busy] Status ${res.status} for ${url}. Retrying in ${waitTime/1000}s...`);
            await delay(waitTime);
            return fetchBgg(url, retryCount + 1);
        }
        
        if (!res.ok && (res.status === 401 || res.status === 403) && headers['Authorization']) {
            console.warn(`BGG Auth failed (${res.status}), retrying without Authorization header...`);
            delete headers['Authorization'];
            res = await fetch(url, { headers });
        }
        
        return res;
    } catch (err) {
        if (retryCount < 5) {
            const waitTime = (retryCount + 1) * 2000;
            console.log(`[Fetch Error] ${err.message}. Retrying in ${waitTime/1000}s...`);
            await delay(waitTime);
            return fetchBgg(url, retryCount + 1);
        }
        throw err;
    }
}

async function getBggImage(name) {
    try {
        // 1. Search for the game
        const searchUrl = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(name)}&exact=1&type=boardgame`;
        const searchRes = await fetchBgg(searchUrl);
        if (!searchRes || !searchRes.ok) {
            console.log(`[Search Fail] for "${name}" (Status: ${searchRes?.status})`);
            return null;
        }
        
        const searchXml = await searchRes.text();
        const searchJson = parser.parse(searchXml);
        
        let items = searchJson.items?.item;
        if (!items) {
            // Try without exact
            const searchUrl2 = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(name)}&type=boardgame`;
            const searchRes2 = await fetchBgg(searchUrl2);
            if (!searchRes2 || !searchRes2.ok) return null;
            const searchXml2 = await searchRes2.text();
            const searchJson2 = parser.parse(searchXml2);
            items = searchJson2.items?.item;
        }
        
        let item = null;
        if (Array.isArray(items)) {
            item = items[0];
        } else if (items) {
            item = items;
        }
        
        if (!item) return null;
        const bggId = item['@_id'];
        
        // 2. Fetch details for BGG ID
        const thingUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${bggId}`;
        const thingRes = await fetchBgg(thingUrl);
        if (!thingRes || !thingRes.ok) {
            console.log(`[Details Fail] for ID ${bggId} (Status: ${thingRes?.status})`);
            return null;
        }
        const thingXml = await thingRes.text();
        const thingJson = parser.parse(thingXml);
        
        const thingItem = thingJson.items?.item;
        if (!thingItem) return null;
        
        const imageUrl = thingItem.image || thingItem.thumbnail;
        return imageUrl;
    } catch (err) {
        console.error(`Error fetching BGG image for "${name}":`, err);
        return null;
    }
}

async function main() {
    console.log("Starting update of board game images from BGG API (with retry & rate-limit handling)...");
    const games = await query("SELECT id, name, image_url FROM board_games");
    console.log(`Found ${games.length} games to check.`);
    
    let updatedCount = 0;
    for (const game of games) {
        // Skip if it's already a BGG image
        if (game.image_url && game.image_url.includes("geekdo-images.com")) {
            console.log(`[Skip] "${game.name}" already has BGG image.`);
            continue;
        }
        
        console.log(`[Fetch] "${game.name}"...`);
        const bggImage = await getBggImage(game.name);
        if (bggImage) {
            await query("UPDATE board_games SET image_url = ? WHERE id = ?", [bggImage, game.id]);
            console.log(`[Update] "${game.name}" image set to: ${bggImage}`);
            updatedCount++;
        } else {
            console.log(`[Warning] No BGG image found for "${game.name}".`);
        }
        
        // Space out requests to avoid hitting rate limits
        await delay(1200);
    }
    
    console.log(`Finished! Updated ${updatedCount} games.`);
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
