import BoardGame from '../models/boardgame.model.js';

// Récupérer tous les jeux de société
export const getBoardGames = async (req, res) => {
    try {
        const games = await BoardGame.findAll();
        res.json(games);
    } catch (error) {
        console.error("Erreur récupération jeux de société :", error);
        res.status(500).json({ error: "Impossible de charger les jeux de société." });
    }
};
