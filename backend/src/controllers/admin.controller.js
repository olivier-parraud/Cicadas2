import { query } from '../config/db.js';
import { XMLParser } from 'fast-xml-parser';

// --- GESTION DES RÉSERVATIONS ---

// Récupérer toutes les réservations
export const getAllReservations = async (req, res) => {
    try {
        const sql = `
            SELECT r.*, u.email, u.firstname, u.lastname, rm.name as tableName
            FROM reservations r
            JOIN users u ON r.user_id = u.id
            JOIN rooms rm ON r.room_id = rm.id
            ORDER BY r.start_time DESC
        `;
        const reservations = await query(sql);
        res.json(reservations);
    } catch (error) {
        console.error("Erreur admin récup réservations :", error);
        res.status(500).json({ error: "Impossible de charger les réservations." });
    }
};

// Mettre à jour le statut d'une réservation (CONFIRMED, CANCELLED...)
export const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ error: "Statut invalide." });
        }

        const sql = 'UPDATE reservations SET status = ? WHERE id = ?';
        await query(sql, [status, id]);
        res.json({ message: "Statut de la réservation mis à jour !" });
    } catch (error) {
        console.error("Erreur modif réservation :", error);
        res.status(500).json({ error: "Erreur lors de la modification de la réservation." });
    }
};

// Supprimer une réservation
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM reservations WHERE id = ?';
        await query(sql, [id]);
        res.json({ message: "Réservation supprimée." });
    } catch (error) {
        console.error("Erreur suppression réservation :", error);
        res.status(500).json({ error: "Erreur lors de la suppression." });
    }
};


// --- GESTION DES UTILISATEURS ---

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const sql = 'SELECT id, email, firstname, lastname, role, created_at FROM users ORDER BY created_at DESC';
        const users = await query(sql);
        res.json(users);
    } catch (error) {
        console.error("Erreur admin récup utilisateurs :", error);
        res.status(500).json({ error: "Impossible de charger les utilisateurs." });
    }
};

// Mettre à jour le rôle d'un utilisateur (USER <-> ADMIN)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ error: "Rôle invalide." });
        }

        // Empêcher un admin de s'auto-rétrograder pour éviter de bloquer le système
        if (Number(id) === req.user.id && role === 'USER') {
            return res.status(400).json({ error: "Vous ne pouvez pas retirer vos propres droits administrateur." });
        }

        const sql = 'UPDATE users SET role = ? WHERE id = ?';
        await query(sql, [role, id]);
        res.json({ message: "Rôle de l'utilisateur mis à jour !" });
    } catch (error) {
        console.error("Erreur modif rôle utilisateur :", error);
        res.status(500).json({ error: "Erreur de modification." });
    }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number(id) === req.user.id) {
            return res.status(400).json({ error: "Vous ne pouvez pas supprimer votre propre compte admin." });
        }

        const sql = 'DELETE FROM users WHERE id = ?';
        await query(sql, [id]);
        res.json({ message: "Utilisateur supprimé." });
    } catch (error) {
        console.error("Erreur suppression utilisateur :", error);
        res.status(500).json({ error: "Erreur lors de la suppression." });
    }
};


// --- CRÉATION & SUPPRESSION DE TOURNOIS ---

// Créer un nouveau tournoi
export const createTournament = async (req, res) => {
    try {
        const { name, game, date, capacity, price, description } = req.body;

        if (!name || !game || !date || !capacity) {
            return res.status(400).json({ error: "Nom, jeu, date et capacité requis." });
        }

        const sql = `
            INSERT INTO tournaments (name, game, date, capacity, price, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [
            name,
            game,
            date, // format YYYY-MM-DD HH:MM:ss
            capacity,
            price || 0.00,
            description || null
        ]);

        res.status(201).json({ message: "Tournoi créé avec succès !", tournamentId: result.insertId });
    } catch (error) {
        console.error("Erreur création tournoi :", error);
        res.status(500).json({ error: "Erreur de création du tournoi." });
    }
};

// Supprimer un tournoi
export const deleteTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM tournaments WHERE id = ?';
        await query(sql, [id]);
        res.json({ message: "Tournoi supprimé." });
    } catch (error) {
        console.error("Erreur suppression tournoi :", error);
        res.status(500).json({ error: "Erreur de suppression." });
    }
};

// --- GESTION DES JEUX DE SOCIÉTÉ ---

// Créer un nouveau jeu de société
export const createBoardGame = async (req, res) => {
    try {
        const { name, min_players, max_players, play_time, category, description, image_url, rules_url } = req.body;

        if (!name || !min_players || !max_players || !play_time || !category) {
            return res.status(400).json({ error: "Nom, joueurs (min/max), durée et catégorie requis." });
        }

        const sql = `
            INSERT INTO board_games (name, min_players, max_players, play_time, category, description, image_url, rules_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [
            name,
            Number(min_players),
            Number(max_players),
            Number(play_time),
            category,
            description || null,
            image_url || '/images/boardgames/catan.png',
            rules_url || null
        ]);

        res.status(201).json({ message: "Jeu de société ajouté avec succès !", boardGameId: result.insertId });
    } catch (error) {
        console.error("Erreur création jeu de société :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du jeu de société." });
    }
};

// Supprimer un jeu de société
export const deleteBoardGame = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM board_games WHERE id = ?';
        await query(sql, [id]);
        res.json({ message: "Jeu de société supprimé." });
    } catch (error) {
        console.error("Erreur suppression jeu de société :", error);
        res.status(500).json({ error: "Erreur de suppression." });
    }
};

// Importer les 50 jeux les plus populaires depuis BoardGameGeek
export const importBggHotGames = async (req, res) => {
    try {
        const BGG_BASE_URL = 'https://boardgamegeek.com/xmlapi2';
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            allowBooleanAttributes: true
        });

        // 1. Récupérer la liste "Hot"
        const hotUrl = `${BGG_BASE_URL}/hot?type=boardgame`;
        const headers = {};
        if (process.env.BGG_API_KEY && process.env.BGG_API_KEY !== 'your_bgg_api_token') {
            headers['Authorization'] = `Bearer ${process.env.BGG_API_KEY}`;
        }
        
        const hotResponse = await fetch(hotUrl, { headers });
        if (!hotResponse.ok) {
            throw new Error(`Erreur récupération classement BGG: ${hotResponse.status}`);
        }
        
        const hotXml = await hotResponse.text();
        const hotJson = parser.parse(hotXml);
        
        const items = hotJson.items?.item;
        if (!items || !Array.isArray(items)) {
            return res.status(500).json({ error: "Impossible de récupérer la liste des jeux chauds BGG." });
        }
        
        const allIds = items.slice(0, 50).map(item => item['@_id']);
        
        // 2. Récupérer les détails par lots de 20
        const chunkSize = 20;
        let gameItems = [];
        
        for (let i = 0; i < allIds.length; i += chunkSize) {
            const chunk = allIds.slice(i, i + chunkSize);
            const idsString = chunk.join(',');
            const thingUrl = `${BGG_BASE_URL}/thing?id=${idsString}`;
            
            const detailsResponse = await fetch(thingUrl, { headers });
            if (!detailsResponse.ok) {
                throw new Error(`Erreur récupération détails BGG: ${detailsResponse.status}`);
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

        // Fonction pour décoder le HTML / Entités XML
        const decodeEntities = (str) => {
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
        };

        // Helper pour traduire de l'anglais vers le français avec Google Translate
        const translateTextToFrench = async (text) => {
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
        };
        
        // Fonction de mapping des catégories en Français
        const mapCategory = (links) => {
            const categories = links
                .filter(l => l['@_type'] === 'boardgamecategory')
                .map(l => l['@_value'].toLowerCase());
                
            if (categories.length === 0) return 'Autre';
            
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
        };

        // 3. Traduire toutes les descriptions en parallèle (concurrence de 10)
        const rawDescriptions = gameItems.map(item => decodeEntities(item.description));
        const translatedDescriptions = [];
        const queue = rawDescriptions.map((desc, idx) => ({ desc, idx }));
        const concurrency = 10;
        
        const worker = async () => {
            while (queue.length > 0) {
                const task = queue.shift();
                if (!task) continue;
                try {
                    translatedDescriptions[task.idx] = await translateTextToFrench(task.desc);
                } catch (err) {
                    translatedDescriptions[task.idx] = task.desc;
                }
            }
        };
        
        await Promise.all(Array.from({ length: concurrency }, () => worker()));

        // 4. Vider la table
        await query('DELETE FROM board_games');
        
        // 5. Insérer les nouveaux jeux
        let inserted = 0;
        for (let index = 0; index < gameItems.length; index++) {
            const item = gameItems[index];
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
        
        res.json({ message: `Importation et traduction réussies de ${inserted} jeux populaires depuis BGG !` });
    } catch (error) {
        console.error("Erreur importation BGG :", error);
        res.status(500).json({ error: error.message || "Erreur lors de l'importation BGG." });
    }
};
