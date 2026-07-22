import Tournament from '../models/tournament.model.js';

// Récupérer la liste des tournois avec le nombre d'inscrits actuels et leurs noms
export const getTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.findAllUpcoming();
        const participants = await Tournament.findParticipants();

        // Associer les participants à chaque tournoi
        const tournamentsWithParticipants = tournaments.map(t => {
            const list = participants
                .filter(p => p.tournament_id === t.id)
                .map(p => {
                    const name = p.pseudo || `${p.firstname || ''} ${p.lastname || ''}`.trim() || p.email.split('@')[0];
                    return {
                        name,
                        avatar_url: p.avatar_url
                    };
                });
            return {
                ...t,
                participants: list
            };
        });

        res.json(tournamentsWithParticipants);
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
        const tourneyInfo = await Tournament.getCapacityAndCount(tournamentId);
        if (!tourneyInfo) {
            return res.status(404).json({ error: "Tournoi non trouvé." });
        }

        const { capacity, registeredCount } = tourneyInfo;

        if (registeredCount >= capacity) {
            return res.status(400).json({ error: "Ce tournoi est complet." });
        }

        // 2. Inscrire l'utilisateur
        await Tournament.register(tournamentId, userId);

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

        const result = await Tournament.unregister(tournamentId, userId);

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
        const ids = await Tournament.findRegisteredIdsByUserId(userId);
        res.json(ids);
    } catch (error) {
        console.error("Erreur récupération inscriptions utilisateur :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

// Récupérer la liste des tournois auxquels l'utilisateur est inscrit
export const getUserTournaments = async (req, res) => {
    try {
        const userId = req.user.id;
        const tournaments = await Tournament.findByUserId(userId);
        res.json(tournaments);
    } catch (error) {
        console.error("Erreur récup tournois utilisateur:", error);
        res.status(500).json({ error: "Impossible de récupérer vos inscriptions aux tournois." });
    }
};
