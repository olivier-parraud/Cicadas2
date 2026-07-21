import { query } from '../config/db.js';

const Reservation = {
    // Créer une réservation avec sélection automatique de table et résolution de conflits
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

        // 4. Vérifier le stock unique (1 exemplaire) du jeu de société sélectionné
        if (specific_game) {
            const checkGameSql = `
                SELECT r.id, r.specific_game
                FROM reservations r
                WHERE r.start_time < ? AND r.end_time > ?
                  AND r.status != 'CANCELLED'
                  AND LOWER(TRIM(r.specific_game)) = LOWER(TRIM(?))
            `;
            const existingBookings = await query(checkGameSql, [endTime, startTime, specific_game]);
            if (existingBookings.length >= 1) {
                throw new Error(`Le jeu "${specific_game}" n'a que 1 exemplaire en stock et il est DÉJÀ RÉSERVÉ pour ce créneau horaire. Il redeviendra disponible une fois ce créneau terminé.`);
            }
        }

        // 5. Normaliser le type de jeu 
        const allowedTypes = ['MTG', 'YUGIOH', 'POKEMON', 'LORCANA', 'ONE_PIECE', 'STAR_WARS', 'FINAL_FF', 'ALTERED', 'DBS', 'BOARD_GAME', 'BYOG', 'OTHER'];
        let safeGameType = allowedTypes.includes(gameType) ? gameType : 'OTHER';

        const sql = `
            INSERT INTO reservations (user_id, room_id, start_time, end_time, game_type, status, specific_game, players_count)
            VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)
        `;

        const result = await query(sql, [user_id, roomId, startTime, endTime, safeGameType, specific_game, players_count]);
        return { id: result.insertId };
    },

    // Récupérer une réservation par son ID
    async findById(id) {
        const sql = 'SELECT * FROM reservations WHERE id = ?';
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Récupérer toutes les réservations d'un jour donné (actives)
    async findByDate(date) {
        const sql = `
            SELECT id, room_id, start_time, end_time, game_type, status, specific_game
            FROM reservations
            WHERE DATE(start_time) = ? AND status != 'CANCELLED'
        `;
        return query(sql, [date]);
    },

    // Récupérer toutes les réservations d'un utilisateur donné (actives & passées)
    async findByUserId(userId) {
        const sql = `
            SELECT r.*, rm.name as room_name, rm.capacity as room_capacity, bg.image_url as boardgame_image_url
            FROM reservations r
            JOIN rooms rm ON r.room_id = rm.id
            LEFT JOIN board_games bg ON LOWER(TRIM(r.specific_game)) = LOWER(TRIM(bg.name))
            WHERE r.user_id = ?
            ORDER BY r.start_time DESC
        `;
        return query(sql, [userId]);
    },

    // Mettre à jour une réservation avec nouveau calcul de disponibilité
    async update(id, { gameType, date, time, duration, specificGame, playersCount }) {
        // 1. Calculer les dates de fin
        const startTime = `${date} ${time}:00`;
        const startObj = new Date(startTime);
        startObj.setHours(startObj.getHours() + parseInt(duration, 10));
        
        const endYear = startObj.getFullYear();
        const endMonth = String(startObj.getMonth() + 1).padStart(2, '0');
        const endDay = String(startObj.getDate()).padStart(2, '0');
        const endHour = String(startObj.getHours()).padStart(2, '0');
        const endMin = String(startObj.getMinutes()).padStart(2, '0');
        const endTime = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMin}:00`;

        // 2. Détecter si une table est libre (en excluant la réservation actuelle pour éviter l'auto-conflit)
        const rooms = await query('SELECT id FROM rooms');
        const sqlOccupied = `
            SELECT room_id FROM reservations 
            WHERE start_time < ? AND end_time > ? AND status != 'CANCELLED' AND id != ?
        `;
        const occupiedRooms = await query(sqlOccupied, [endTime, startTime, id]);
        const occupiedIds = occupiedRooms.map(r => r.room_id);
        
        const availableRoom = rooms.find(r => !occupiedIds.includes(r.id));
        if (!availableRoom) {
            throw new Error("Toutes les tables de jeux sont complètes pour ce créneau horaire.");
        }
        const roomId = availableRoom.id;

        // 3. Vérifier le stock unique (1 exemplaire) du jeu de société sélectionné
        if (specificGame) {
            const checkGameSql = `
                SELECT r.id, r.specific_game
                FROM reservations r
                WHERE r.start_time < ? AND r.end_time > ?
                  AND r.status != 'CANCELLED'
                  AND r.id != ?
                  AND LOWER(TRIM(r.specific_game)) = LOWER(TRIM(?))
            `;
            const existingBookings = await query(checkGameSql, [endTime, startTime, id, specificGame]);
            if (existingBookings.length >= 1) {
                throw new Error(`Le jeu "${specificGame}" n'a que 1 exemplaire en stock et il est DÉJÀ RÉSERVÉ pour ce créneau horaire. Il redeviendra disponible une fois ce créneau terminé.`);
            }
        }

        // 4. Normaliser le type de jeu 
        const allowedTypes = ['MTG', 'YUGIOH', 'POKEMON', 'LORCANA', 'ONE_PIECE', 'STAR_WARS', 'FINAL_FF', 'ALTERED', 'DBS', 'BOARD_GAME', 'BYOG', 'OTHER'];
        let safeGameType = allowedTypes.includes(gameType) ? gameType : 'OTHER';

        const updateSql = `
            UPDATE reservations 
            SET room_id = ?, start_time = ?, end_time = ?, game_type = ?, specific_game = ?, players_count = ?
            WHERE id = ?
        `;
        return query(updateSql, [
            roomId, 
            startTime, 
            endTime, 
            safeGameType, 
            specificGame || null, 
            playersCount ? parseInt(playersCount, 10) : 2,
            id
        ]);
    },

    // Récupérer les jeux déjà réservés (hors stock) pour un créneau donné
    async checkGameAvailability(date, time, duration) {
        if (!date || !time || !duration) return [];

        const startTime = `${date} ${time}:00`;
        const startObj = new Date(startTime);
        startObj.setHours(startObj.getHours() + parseInt(duration, 10));

        const endYear = startObj.getFullYear();
        const endMonth = String(startObj.getMonth() + 1).padStart(2, '0');
        const endDay = String(startObj.getDate()).padStart(2, '0');
        const endHour = String(startObj.getHours()).padStart(2, '0');
        const endMin = String(startObj.getMinutes()).padStart(2, '0');
        const endTime = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMin}:00`;

        const sql = `
            SELECT LOWER(TRIM(specific_game)) as game_name
            FROM reservations
            WHERE start_time < ? AND end_time > ? 
              AND status != 'CANCELLED' 
              AND specific_game IS NOT NULL 
              AND specific_game != ''
        `;
        const results = await query(sql, [endTime, startTime]);
        return results.map(r => r.game_name);
    },

    // Annuler/supprimer définitivement une réservation
    async delete(id) {
        const sql = 'DELETE FROM reservations WHERE id = ?';
        return query(sql, [id]);
    },

    // Récupérer toutes les réservations avec détails des utilisateurs et tables (Admin)
    async findAllWithDetails() {
        const sql = `
            SELECT r.*, u.email, u.firstname, u.lastname, rm.name as tableName
            FROM reservations r
            JOIN users u ON r.user_id = u.id
            JOIN rooms rm ON r.room_id = rm.id
            ORDER BY r.start_time DESC
        `;
        return query(sql);
    },

    // Mettre à jour le statut d'une réservation (CONFIRMED, CANCELLED...) (Admin)
    async updateStatus(id, status) {
        const sql = 'UPDATE reservations SET status = ? WHERE id = ?';
        return query(sql, [status, id]);
    }
};

export default Reservation;