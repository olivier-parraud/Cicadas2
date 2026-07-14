import BoardGame from '../models/boardgame.model.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Récupérer tous les jeux de société
export const getBoardGames = async (req, res) => {
    try {
        const games = await BoardGame.findAll();
        res.json(games);
    } catch (error) {
        console.error("Erreur récupération jeux de société depuis la base de données, tentative de basculement sur le fichier JSON local :", error);
        try {
            const jsonPath = path.join(__dirname, '..', 'data', 'boardgame-list.json');
            const data = await fs.readFile(jsonPath, 'utf8');
            const gamesList = JSON.parse(data);

            // Mettre en place des valeurs par défaut pour les propriétés requises par l'affichage du catalogue
            const fallbackGames = gamesList.map((game, index) => {
                return {
                    id: index + 10000, // IDs fictifs élevés
                    name: game.name,
                    min_players: 2,
                    max_players: 4,
                    play_time: 45,
                    category: "Famille",
                    description: `Jeu de société : ${game.name}. Ce jeu fait partie de la ludothèque Cicados. (Données de secours chargées depuis le fichier local en raison d'une panne de l'API principale / base de données).`,
                    image_url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600',
                    rules_url: null
                };
            });

            res.json(fallbackGames);
        } catch (jsonError) {
            console.error("Erreur critique : impossible de lire le fichier JSON de secours :", jsonError);
            res.status(500).json({ error: "Impossible de charger les jeux de société (panne API principale et secours indisponible)." });
        }
    }
};
