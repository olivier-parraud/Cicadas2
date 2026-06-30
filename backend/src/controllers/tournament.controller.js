import { query } from '../config/db.js';

// Récupérer la liste des tournois avec le nombre d'inscrits actuels
export const getTournaments = async (req, res) => {
    try {
        const sql = `
            SELECT t.*, COUNT(tr.id) as registeredCount
            FROM tournaments t
            LEFT JOIN tournament_registrations tr ON t.id = tr.tournament_id
            GROUP BY t.id
            ORDER BY t.date ASC
        `;
        const tournaments = await query(sql);
        res.json(tournaments);
    } catch (error) {
        console.error("Erreur récupération tournois :", error);
        res.status(500).json({ error: "Impossible de charger les tournois." });
    }
};

// S'inscrire à un tournoi
export const registerForTournament = async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const userId = req.user.id; // Injecté par authMiddleware

        // 1. Vérifier si le tournoi existe et sa capacité
        const tourneySql = `
            SELECT t.capacity, COUNT(tr.id) as registeredCount
            FROM tournaments t
            LEFT JOIN tournament_registrations tr ON t.id = tr.tournament_id
            WHERE t.id = ?
            GROUP BY t.id
        `;
        const results = await query(tourneySql, [tournamentId]);
        if (results.length === 0) {
            return res.status(404).json({ error: "Tournoi non trouvé." });
        }

        const { capacity, registeredCount } = results[0];

        if (registeredCount >= capacity) {
            return res.status(400).json({ error: "Ce tournoi est complet." });
        }

        // 2. Inscrire l'utilisateur
        const insertSql = `
            INSERT INTO tournament_registrations (tournament_id, user_id)
            VALUES (?, ?)
        `;
        await query(insertSql, [tournamentId, userId]);

        res.status(201).json({ message: "Inscription au tournoi réussie !" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Vous êtes déjà inscrit à ce tournoi." });
        }
        console.error("Erreur inscription tournoi :", error);
        res.status(500).json({ error: "Erreur lors de l'inscription au tournoi." });
    }
};

// Se désinscrire d'un tournoi
export const unregisterFromTournament = async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const userId = req.user.id;

        const deleteSql = `
            DELETE FROM tournament_registrations
            WHERE tournament_id = ? AND user_id = ?
        `;
        const result = await query(deleteSql, [tournamentId, userId]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Vous n'étiez pas inscrit à ce tournoi." });
        }

        res.json({ message: "Désinscription réussie." });
    } catch (error) {
        console.error("Erreur désinscription tournoi :", error);
        res.status(500).json({ error: "Erreur lors de la désinscription." });
    }
};

// Récupérer les inscriptions de l'utilisateur connecté
export const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;
        const sql = `
            SELECT tournament_id
            FROM tournament_registrations
            WHERE user_id = ?
        `;
        const regs = await query(sql, [userId]);
        const ids = regs.map(r => r.tournament_id);
        res.json(ids);
    } catch (error) {
        console.error("Erreur récupération inscriptions utilisateur :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};
