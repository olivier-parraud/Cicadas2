import { query } from '../config/db.js';

// Récupérer tous les jeux de société
export const getBoardGames = async (req, res) => {
    try {
        const sql = 'SELECT * FROM board_games ORDER BY name ASC';
        const games = await query(sql);
        res.json(games);
    } catch (error) {
        console.error("Erreur récupération jeux de société :", error);
        res.status(500).json({ error: "Impossible de charger les jeux de société." });
    }
};
