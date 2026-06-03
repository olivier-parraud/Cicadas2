import Reservation from '../models/reservation.model.js';

export const createReservation = async (req, res) => {
    try {
        const { gameType, date, time, duration } = req.body;
        
        // req.user est injecté automatiquement par notre authMiddleware !
        const userId = req.user.id; 

        if (!date || !time || !duration) {
            return res.status(400).json({ error: 'Remplissez le formulaire en entier' });
        }

        const reservation = await Reservation.create({
            user_id: userId,
            date,
            time,
            duration,
            gameType
        });

        res.status(201).json({ message: 'Réservation réussie !', reservation });
    } catch (error) {
        console.error("Erreur dans API réservation:", error);
        res.status(500).json({ error: 'Erreur serveur interne.' });
    }
};