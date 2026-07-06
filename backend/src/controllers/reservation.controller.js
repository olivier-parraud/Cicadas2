import Reservation from '../models/reservation.model.js';
import { query } from '../config/db.js';

export const createReservation = async (req, res) => {
    try {
        const { gameType, date, time, duration, specificGame, playersCount } = req.body;
        
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

        const sql = `
            SELECT id, room_id, start_time, end_time, game_type, status, specific_game
            FROM reservations
            WHERE DATE(start_time) = ? AND status != 'CANCELLED'
        `;
        const reservations = await query(sql, [date]);
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
        const sql = `
            SELECT r.id, r.room_id, r.start_time, r.end_time, r.game_type, r.status, r.specific_game, r.players_count, rm.name as room_name, rm.capacity as room_capacity
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            WHERE r.user_id = ?
            ORDER BY r.start_time DESC
        `;
        const reservations = await query(sql, [userId]);
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
        const checkSql = "SELECT user_id, room_id FROM reservations WHERE id = ?";
        const checkResults = await query(checkSql, [id]);
        if (checkResults.length === 0) {
            return res.status(404).json({ error: "Réservation non trouvée" });
        }
        if (checkResults[0].user_id !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Vous n'avez pas l'autorisation de modifier cette réservation" });
        }

        // 2. Calculer les nouveaux temps
        const startTime = `${date} ${time}:00`;
        const startObj = new Date(startTime);
        startObj.setHours(startObj.getHours() + parseInt(duration, 10));
        
        const endYear = startObj.getFullYear();
        const endMonth = String(startObj.getMonth() + 1).padStart(2, '0');
        const endDay = String(startObj.getDate()).padStart(2, '0');
        const endHour = String(startObj.getHours()).padStart(2, '0');
        const endMin = String(startObj.getMinutes()).padStart(2, '0');
        const endTime = `${endYear}-${endMonth}-${endDay} ${endHour}-${endMin}-00`;

        // 3. Détecter si une table est libre (en excluant la réservation actuelle pour éviter l'auto-conflit)
        const rooms = await query('SELECT id FROM rooms');
        const sqlOccupied = `
            SELECT room_id FROM reservations 
            WHERE start_time < ? AND end_time > ? AND status != 'CANCELLED' AND id != ?
        `;
        const occupiedRooms = await query(sqlOccupied, [endTime, startTime, id]);
        const occupiedIds = occupiedRooms.map(r => r.room_id);
        
        const availableRoom = rooms.find(r => !occupiedIds.includes(r.id));
        if (!availableRoom) {
            return res.status(400).json({ error: "Toutes les tables de jeux sont complètes pour ce créneau horaire." });
        }
        const roomId = availableRoom.id;

        // 4. Mettre à jour la réservation
        const allowedTypes = ['MTG', 'YUGIOH', 'POKEMON', 'LORCANA', 'BOARD_GAME', 'OTHER'];
        let safeGameType = allowedTypes.includes(gameType) ? gameType : 'OTHER';

        const updateSql = `
            UPDATE reservations 
            SET room_id = ?, start_time = ?, end_time = ?, game_type = ?, specific_game = ?, players_count = ?
            WHERE id = ?
        `;
        await query(updateSql, [
            roomId, 
            startTime, 
            endTime, 
            safeGameType, 
            specificGame, 
            playersCount ? parseInt(playersCount, 10) : 2,
            id
        ]);

        res.json({ message: "Réservation modifiée avec succès !" });
    } catch (error) {
        console.error("Erreur modification réservation:", error);
        res.status(500).json({ error: "Erreur serveur lors de la modification de la réservation." });
    }
};

// Annuler une réservation
export const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Vérifier que la réservation appartient à l'utilisateur
        const checkSql = "SELECT id, user_id FROM reservations WHERE id = ?";
        const results = await query(checkSql, [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: "Réservation non trouvée" });
        }
        
        if (results[0].user_id !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Vous n'avez pas l'autorisation d'annuler cette réservation" });
        }
        
        const deleteSql = "DELETE FROM reservations WHERE id = ?";
        await query(deleteSql, [id]);
        
        res.json({ message: "Réservation annulée avec succès !" });
    } catch (error) {
        console.error("Erreur annulation réservation:", error);
        res.status(500).json({ error: "Impossible d'annuler la réservation." });
    }
};