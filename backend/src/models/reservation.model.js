import { query } from '../config/db.js';

const Reservation = {
    async create({ user_id, date, time, duration, gameType, specific_game = null, players_count = 2 }) {
        // 1. S'assurer de la présence d'au moins 4 tables de jeux distinctes
        let rooms = await query('SELECT id FROM rooms');
        if (rooms.length < 4) {
            // Vider les réservations liées temporairement pour réinitialiser proprement les tables
            await query('DELETE FROM reservations');
            await query('DELETE FROM rooms');

            await query(`
                INSERT INTO rooms (name, capacity, description) VALUES 
                ('Table 1 (Magic / TCG)', 4, 'Table parfaite pour Magic et autres TCG'),
                ('Table 2 (Yu-Gi-Oh / Lorcana)', 4, 'Table dédiée aux duels de cartes'),
                ('Table 3 (Jeux de Société)', 6, 'Grande table ronde idéale pour les jeux de plateau'),
                ('Table 4 (Jeux de Société)', 6, 'Grande table rectangulaire idéale pour les jeux de plateau')
            `);
            rooms = await query('SELECT id FROM rooms');
        }

        // 2. Calcul des dates (start_time et end_time)
        const startTime = `${date} ${time}:00`;
        const startObj = new Date(startTime);

        // Ajouter la durée en heures
        startObj.setHours(startObj.getHours() + parseInt(duration, 10));

        // Formatage manuel pour MySQL (YYYY-MM-DD HH:MM:SS) 
        const endYear = startObj.getFullYear();
        const endMonth = String(startObj.getMonth() + 1).padStart(2, '0');
        const endDay = String(startObj.getDate()).padStart(2, '0');
        const endHour = String(startObj.getHours()).padStart(2, '0');
        const endMin = String(startObj.getMinutes()).padStart(2, '0');
        const endTime = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMin}:00`;

        // 3. Détecter les tables occupées pendant ce créneau horaire
        // Deux intervalles [S1, E1] et [S2, E2] se chevauchent si S1 < E2 et E1 > S2
        const sqlOccupied = `
            SELECT room_id FROM reservations 
            WHERE start_time < ? AND end_time > ? AND status != 'CANCELLED'
        `;
        const occupiedRooms = await query(sqlOccupied, [endTime, startTime]);
        const occupiedIds = occupiedRooms.map(r => r.room_id);

        // Trouver la première table disponible
        const availableRoom = rooms.find(r => !occupiedIds.includes(r.id));
        if (!availableRoom) {
            throw new Error("Toutes les tables de jeux sont complètes pour ce créneau horaire.");
        }

        const roomId = availableRoom.id;

        // 4. Normaliser le type de jeu 
        const allowedTypes = ['MTG', 'YUGIOH', 'POKEMON', 'LORCANA', 'BOARD_GAME', 'OTHER'];
        let safeGameType = allowedTypes.includes(gameType) ? gameType : 'OTHER';

        const sql = `
            INSERT INTO reservations (user_id, room_id, start_time, end_time, game_type, status, specific_game, players_count)
            VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)
        `;

        const result = await query(sql, [user_id, roomId, startTime, endTime, safeGameType, specific_game, players_count]);
        return { id: result.insertId };
    }
};

export default Reservation;