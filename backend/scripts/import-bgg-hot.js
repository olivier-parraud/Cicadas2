import 'dotenv/config';
import { XMLParser } from 'fast-xml-parser';
import { query } from '../src/config/db.js';

const BGG_BASE_URL = 'https://boardgamegeek.com/xmlapi2';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true
});

// Fonction pour traduire un texte de l'anglais vers le français avec l'API publique de Google Translate
async function translateTextToFrench(text) {
    if (!text) return '';
    try {
        const paragraphs = text.split('\n');
        const translatedParagraphs = [];
        
        for (const paragraph of paragraphs) {
            const trimmed = paragraph.trim();
            if (!trimmed) {
                translatedParagraphs.push('');
                continue;
            }
            
            // Si le paragraphe est trop long, on le découpe en morceaux de 1000 caractères max
            const maxLen = 1000;
            if (trimmed.length > maxLen) {
                let chunkResult = '';
                for (let i = 0; i < trimmed.length; i += maxLen) {
                    const chunk = trimmed.substring(i, i + maxLen);
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(chunk)}`;
                    const response = await fetch(url);
                    if (response.ok) {
                        const json = await response.json();
                        if (json && json[0]) {
                            chunkResult += json[0].map(item => item[0]).join('');
                        } else {
                            chunkResult += chunk;
                        }
                    } else {
                        chunkResult += chunk;
                    }
                }
                translatedParagraphs.push(chunkResult);
            } else {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(trimmed)}`;
                const response = await fetch(url);
                if (response.ok) {
                    const json = await response.json();
                    if (json && json[0]) {
                        translatedParagraphs.push(json[0].map(item => item[0]).join(''));
                    } else {
                        translatedParagraphs.push(trimmed);
                    }
                } else {
                    translatedParagraphs.push(trimmed);
                }
            }
        }
        
        return translatedParagraphs.join('\n');
    } catch (err) {
        console.error("Erreur de traduction:", err);
        return text;
    }
}

async function main() {
    console.log("Début de l'importation des 50 jeux les plus populaires depuis BGG...");
    
    // 1. Récupérer la liste "Hot"
    const hotUrl = `${BGG_BASE_URL}/hot?type=boardgame`;
    const headers = {};
    if (process.env.BGG_API_KEY && process.env.BGG_API_KEY !== 'your_bgg_api_token') {
        headers['Authorization'] = `Bearer ${process.env.BGG_API_KEY}`;
    }
    
    console.log(`Récupération du classement Hot de BGG : ${hotUrl}`);
    const hotResponse = await fetch(hotUrl, { headers });
    if (!hotResponse.ok) {
        throw new Error(`Erreur lors de la récupération du classement BGG (Status: ${hotResponse.status})`);
    }
    
    const hotXml = await hotResponse.text();
    const hotJson = parser.parse(hotXml);
    
    const items = hotJson.items?.item;
    if (!items || !Array.isArray(items)) {
        throw new Error("Impossible de récupérer la liste des jeux chauds (format incorrect).");
    }
    
    // Récupérer les 50 premiers IDs
    const allIds = items.slice(0, 50).map(item => item['@_id']);
    console.log(`IDs récupérés (${allIds.length} jeux).`);
    
    // 2. Récupérer les détails de ces 50 jeux par lots de 20
    const chunkSize = 20;
    let gameItems = [];
    
    for (let i = 0; i < allIds.length; i += chunkSize) {
        const chunk = allIds.slice(i, i + chunkSize);
        const idsString = chunk.join(',');
        const thingUrl = `${BGG_BASE_URL}/thing?id=${idsString}`;
        console.log(`Récupération du lot de détails (${i + 1} à ${Math.min(i + chunkSize, allIds.length)}) : ${thingUrl}`);
        
        const detailsResponse = await fetch(thingUrl, { headers });
        if (!detailsResponse.ok) {
            throw new Error(`Erreur lors de la récupération des détails des jeux (Status: ${detailsResponse.status})`);
        }
        
        const detailsXml = await detailsResponse.text();
        const detailsJson = parser.parse(detailsXml);
        
        let chunkGameItems = detailsJson.items?.item;
        if (chunkGameItems) {
            if (!Array.isArray(chunkGameItems)) {
                chunkGameItems = [chunkGameItems];
            }
            gameItems.push(...chunkGameItems);
        }
    }
    
    console.log(`Détails de ${gameItems.length} jeux récupérés au total.`);
    
    // Fonction pour décoder le HTML / Entités XML
    function decodeEntities(str) {
        if (!str) return '';
        return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#10;/g, '\n')
            .replace(/&ndash;/g, '–')
            .replace(/&mdash;/g, '—')
            .replace(/&rsquo;/g, "'");
    }
    
    // Fonction de mapping des catégories en Français
    function mapCategory(links) {
        const categories = links
            .filter(l => l['@_type'] === 'boardgamecategory')
            .map(l => l['@_value'].toLowerCase());
            
        if (categories.length === 0) return 'Autre';
        
        // Règles de mapping
        if (categories.some(c => c.includes('strategy') || c.includes('economic') || c.includes('civilization') || c.includes('industry'))) {
            return 'Stratégie';
        }
        if (categories.some(c => c.includes('tile placement'))) {
            return 'Pose de tuiles';
        }
        if (categories.some(c => c.includes('family') || c.includes('children'))) {
            return 'Famille';
        }
        if (categories.some(c => c.includes('abstract'))) {
            return 'Abstrait';
        }
        if (categories.some(c => c.includes('party') || c.includes('humor') || c.includes('action') || c.includes('dexterity'))) {
            return 'Ambiance';
        }
        
        // Traductions à la volée de catégories communes
        const firstCat = links.find(l => l['@_type'] === 'boardgamecategory')?.['@_value'] || 'Autre';
        const translations = {
            'Card Game': 'Jeu de cartes',
            'Fantasy': 'Fantastique',
            'Adventure': 'Aventure',
            'Dice': 'Dés',
            'Medieval': 'Médiéval',
            'Science Fiction': 'Science-Fiction',
            'Miniatures': 'Figurines',
            'Exploration': 'Exploration',
            'Bluffing': 'Bluff',
            'Deduction': 'Déduction',
            'Fighting': 'Combat',
            'Ancient': 'Antiquité'
        };
        return translations[firstCat] || firstCat;
    }
    
    // 3. Traduire les descriptions en français en parallèle
    console.log("Traduction des descriptions en français...");
    const rawDescriptions = gameItems.map(item => decodeEntities(item.description));
    
    const concurrency = 10;
    const translatedDescriptions = [];
    const queue = rawDescriptions.map((desc, idx) => ({ desc, idx }));
    
    async function worker() {
        while (queue.length > 0) {
            const task = queue.shift();
            if (!task) continue;
            try {
                translatedDescriptions[task.idx] = await translateTextToFrench(task.desc);
            } catch (err) {
                translatedDescriptions[task.idx] = task.desc;
            }
        }
    }
    
    await Promise.all(Array.from({ length: concurrency }, () => worker()));
    console.log("Traduction terminée.");

    // 4. Vider la table existante
    console.log("Vidage de la table 'board_games'...");
    await query('DELETE FROM board_games');
    
    // 5. Insérer les nouveaux jeux
    let inserted = 0;
    for (let index = 0; index < gameItems.length; index++) {
        const item = gameItems[index];
        // Nom principal
        let name = '';
        if (Array.isArray(item.name)) {
            const primary = item.name.find(n => n['@_type'] === 'primary');
            name = primary ? primary['@_value'] : item.name[0]['@_value'];
        } else if (item.name) {
            name = item.name['@_value'] || item.name;
        }
        
        const minPlayers = Number(item.minplayers?.['@_value'] || 1);
        const maxPlayers = Number(item.maxplayers?.['@_value'] || 99);
        const playTime = Number(item.playingtime?.['@_value'] || 30);
        
        const links = Array.isArray(item.link) ? item.link : (item.link ? [item.link] : []);
        const category = mapCategory(links);
        
        const description = translatedDescriptions[index];
        const imageUrl = item.image || item.thumbnail || 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600';
        const rulesUrl = `https://boardgamegeek.com/boardgame/${item['@_id']}`;
        
        await query(
            'INSERT INTO board_games (name, min_players, max_players, play_time, category, description, image_url, rules_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, minPlayers, maxPlayers, playTime, category, description, imageUrl, rulesUrl]
        );
        inserted++;
    }
    
    console.log(`Succès ! ${inserted} jeux populaires ont été importés et traduits avec succès dans la table 'board_games'.`);
    process.exit(0);
}

main().catch(err => {
    console.error("Une erreur est survenue lors de l'importation :", err);
    process.exit(1);
});
