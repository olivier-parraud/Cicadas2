import { query } from '../config/db.js';

const Event = {
    // Récupérer la liste des événements à venir (date >= NOW)
    async findAllUpcoming() {
        const sql = `
            SELECT e.*, COUNT(er.id) as registeredCount
            FROM events e
            LEFT JOIN event_registrations er ON e.id = er.event_id
            WHERE e.date >= NOW()
            GROUP BY e.id
            ORDER BY e.date ASC
        `;
        return query(sql);
    },

    // Récupérer tous les participants de tous les événements
    async findParticipants() {
        const sql = `
            SELECT er.event_id, u.firstname, u.lastname, u.email, u.pseudo
            FROM event_registrations er
            JOIN users u ON er.user_id = u.id
        `;
        return query(sql);
    },

    // Récupérer la capacité et le nombre d'inscrits pour un événement donné
    async getCapacityAndCount(id) {
        const sql = `
            SELECT e.capacity, COUNT(er.id) as registeredCount
            FROM events e
            LEFT JOIN event_registrations er ON e.id = er.event_id
            WHERE e.id = ?
            GROUP BY e.id
        `;
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Inscrire un utilisateur à un événement
    async register(eventId, userId) {
        const sql = `
            INSERT INTO event_registrations (event_id, user_id)
            VALUES (?, ?)
        `;
        return query(sql, [eventId, userId]);
    },

    // Désinscrire un utilisateur d'un événement
    async unregister(eventId, userId) {
        const sql = `
            DELETE FROM event_registrations
            WHERE event_id = ? AND user_id = ?
        `;
        return query(sql, [eventId, userId]);
    },

    // Récupérer la liste des IDs d'événements réservés par l'utilisateur
    async findRegisteredIdsByUserId(userId) {
        const sql = `
            SELECT event_id
            FROM event_registrations
            WHERE user_id = ?
        `;
        const regs = await query(sql, [userId]);
        return regs.map(r => r.event_id);
    },

    // Récupérer les détails des événements d'un utilisateur connecté
    async findByUserId(userId) {
        const sql = `
            SELECT e.*, COUNT(er_all.id) as registeredCount
            FROM event_registrations er
            JOIN events e ON er.event_id = e.id
            LEFT JOIN event_registrations er_all ON e.id = er_all.event_id
            WHERE er.user_id = ?
            GROUP BY e.id
            ORDER BY e.date ASC
        `;
        return query(sql, [userId]);
    },

    // Créer un événement (Admin)
    async create({ name, type, game, date, capacity, price, description }) {
        const sql = `
            INSERT INTO events (name, type, game, date, capacity, price, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [name, type, game, date, capacity, price, description]);
        return { id: result.insertId, name, type, game, date, capacity, price, description };
    },

    // Supprimer un événement (Admin)
    async delete(id) {
        const sql = 'DELETE FROM events WHERE id = ?';
        return query(sql, [id]);
    },

    // Modifier un événement (Admin)
    async update(id, { name, type, game, date, capacity, price, description }) {
        const sql = `
            UPDATE events
            SET name = ?, type = ?, game = ?, date = ?, capacity = ?, price = ?, description = ?
            WHERE id = ?
        `;
        return query(sql, [name, type, game, date, capacity, price, description, id]);
    }
};

export default Event;
