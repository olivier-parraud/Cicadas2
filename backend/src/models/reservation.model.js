import { query } from '../config/db.js';

const Reservation = {
    async create({ user_id, date, time, duration, gameType, specific_game = null }) {
        // 1. Obtenir ou créer une salle (room) par défaut si elle n'existe pas encore
        let rooms = await query('SELECT id FROM rooms LIMIT 1');
        let roomId;
        if (rooms.length === 0) {
            const newRoom = await query("INSERT INTO rooms (name, capacity, description) VALUES ('Table TCG Standard', 4, 'Table spacieuse parfaite pour les tapis de jeu')");
            roomId = newRoom.insertId;
        } else {
            roomId = rooms[0].id;
        }

        // 2. Calcul des Dates (start_time et end_time)
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

        // 3. Normaliser le type de jeu 
        // (Notre base de données accepte 'MTG', 'BOARD_GAME', ou 'OTHER')
        let safeGameType = 'OTHER';
        if (gameType === 'MTG') {
            safeGameType = 'MTG';
        } else if (gameType === 'BOARD_GAME') {
            safeGameType = 'BOARD_GAME';
        }

        const sql = `
            INSERT INTO reservations (user_id, room_id, start_time, end_time, game_type, status, specific_game)
            VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?)
        `;

        const result = await query(sql, [user_id, roomId, startTime, endTime, safeGameType, specific_game]);
        return { id: result.insertId };
    }
};

export default Reservation;