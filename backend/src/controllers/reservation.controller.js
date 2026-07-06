import Reservation from '../models/reservation.model.js';

export const createReservation = async (req, res) => {
    try {
        const { gameType, date, time, duration, specificGame, playersCount } = req.body;
        const userId = req.user.id; 

        if (!date || !time || !duration) {
            return res.status(400).json({ error: 'Remplissez le formulaire en entier' });
        }

        const reservation = await Reservation.create({
            user_id: userId,
            date,
            time,
            duration,
            gameType,
            specific_game: specificGame,
            players_count: playersCount ? parseInt(playersCount, 10) : 2
        });

        res.status(201).json({ message: 'Réservation réussie !', reservation });
    } catch (error) {
        console.error("Erreur dans API réservation:", error);
        if (error.message && error.message.includes("complètes")) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erreur serveur interne.' });
    }
};

// Récupérer toutes les réservations pour une date donnée
export const getReservationsByDate = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: "Le paramètre date est requis" });
        }

        const reservations = await Reservation.findByDate(date);
        res.json(reservations);
    } catch (error) {
        console.error("Erreur récup réservations par date:", error);
        res.status(500).json({ error: "Impossible de charger les créneaux." });
    }
};

// Récupérer toutes les réservations de l'utilisateur connecté
export const getUserReservations = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservations = await Reservation.findByUserId(userId);
        res.json(reservations);
    } catch (error) {
        console.error("Erreur récup réservations utilisateur:", error);
        res.status(500).json({ error: "Impossible de récupérer vos réservations." });
    }
};

// Modifier une réservation
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { gameType, date, time, duration, specificGame, playersCount } = req.body;
        
        if (!date || !time || !duration) {
            return res.status(400).json({ error: 'Remplissez les informations requises (date, heure, durée)' });
        }

        // 1. Vérifier la propriété de la réservation
        const checkResults = await Reservation.findById(id);
        if (!checkResults) {
            return res.status(404).json({ error: "Réservation non trouvée" });
        }
        if (checkResults.user_id !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Vous n'avez pas l'autorisation de modifier cette réservation" });
        }

        // 2. Mettre à jour via le modèle (gère la détection de conflit de table)
        await Reservation.update(id, { gameType, date, time, duration, specificGame, playersCount });

        res.json({ message: "Réservation modifiée avec succès !" });
    } catch (error) {
        console.error("Erreur modification réservation:", error);
        if (error.message && error.message.includes("complètes")) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Erreur serveur lors de la modification de la réservation." });
    }
};

// Annuler une réservation
export const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Vérifier que la réservation appartient à l'utilisateur
        const results = await Reservation.findById(id);
        if (!results) {
            return res.status(404).json({ error: "Réservation non trouvée" });
        }
        
        if (results.user_id !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Vous n'avez pas l'autorisation d'annuler cette réservation" });
        }
        
        await Reservation.delete(id);
        
        res.json({ message: "Réservation annulée avec succès !" });
    } catch (error) {
        console.error("Erreur annulation réservation:", error);
        res.status(500).json({ error: "Impossible d'annuler la réservation." });
    }
};