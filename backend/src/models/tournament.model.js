import { query } from '../config/db.js';

const Tournament = {
    // Récupérer la liste des tournois à venir (date >= NOW)
    async findAllUpcoming() {
        const sql = `
            SELECT t.*, COUNT(tr.id) as registeredCount
            FROM tournaments t
            LEFT JOIN tournament_registrations tr ON t.id = tr.tournament_id
            WHERE t.date >= NOW()
            GROUP BY t.id
            ORDER BY t.date ASC
        `;
        return query(sql);
    },

    // Récupérer tous les participants de tous les tournois
    async findParticipants() {
        const sql = `
            SELECT tr.tournament_id, u.firstname, u.lastname, u.email, u.pseudo
            FROM tournament_registrations tr
            JOIN users u ON tr.user_id = u.id
        `;
        return query(sql);
    },

    // Récupérer la capacité et le nombre d'inscrits pour un tournoi donné
    async getCapacityAndCount(id) {
        const sql = `
            SELECT t.capacity, COUNT(tr.id) as registeredCount
            FROM tournaments t
            LEFT JOIN tournament_registrations tr ON t.id = tr.tournament_id
            WHERE t.id = ?
            GROUP BY t.id
        `;
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Inscrire un utilisateur à un tournoi
    async register(tournamentId, userId) {
        const sql = `
            INSERT INTO tournament_registrations (tournament_id, user_id)
            VALUES (?, ?)
        `;
        return query(sql, [tournamentId, userId]);
    },

    // Désinscrire un utilisateur d'un tournoi
    async unregister(tournamentId, userId) {
        const sql = `
            DELETE FROM tournament_registrations
            WHERE tournament_id = ? AND user_id = ?
        `;
        return query(sql, [tournamentId, userId]);
    },

    // Récupérer la liste des IDs de tournois réservés par l'utilisateur
    async findRegisteredIdsByUserId(userId) {
        const sql = `
            SELECT tournament_id
            FROM tournament_registrations
            WHERE user_id = ?
        `;
        const regs = await query(sql, [userId]);
        return regs.map(r => r.tournament_id);
    },

    // Récupérer les détails des tournois d'un utilisateur connecté
    async findByUserId(userId) {
        const sql = `
            SELECT t.*, COUNT(tr_all.id) as registeredCount
            FROM tournament_registrations tr
            JOIN tournaments t ON tr.tournament_id = t.id
            LEFT JOIN tournament_registrations tr_all ON t.id = tr_all.tournament_id
            WHERE tr.user_id = ?
            GROUP BY t.id
            ORDER BY t.date ASC
        `;
        return query(sql, [userId]);
    },

    // Créer un tournoi (Admin)
    async create({ name, game, date, capacity, price, description }) {
        const sql = `
            INSERT INTO tournaments (name, game, date, capacity, price, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [name, game, date, capacity, price, description]);
        return { id: result.insertId, name, game, date, capacity, price, description };
    },

    // Supprimer un tournoi (Admin)
    async delete(id) {
        const sql = 'DELETE FROM tournaments WHERE id = ?';
        return query(sql, [id]);
    }
};

export default Tournament;
