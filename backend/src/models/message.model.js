import { query } from '../config/db.js';

const Message = {
    // Créer un message
    async create({ userId, subject, content }) {
        const sql = 'INSERT INTO messages (user_id, subject, content) VALUES (?, ?, ?)';
        return query(sql, [userId, subject, content]);
    },

    // Récupérer tous les messages avec les infos de l'expéditeur
    async findAll() {
        const sql = `
            SELECT m.*, u.firstname, u.lastname, u.email, u.pseudo, u.avatar_url
            FROM messages m
            JOIN users u ON m.user_id = u.id
            ORDER BY m.created_at DESC
        `;
        return query(sql);
    },

    // Récupérer les messages d'un utilisateur spécifique
    async findByUserId(userId) {
        const sql = 'SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC';
        return query(sql, [userId]);
    },

    // Répondre à un message (Admin)
    async reply(id, replyText) {
        const sql = 'UPDATE messages SET admin_reply = ?, replied_at = NOW(), user_read = 0 WHERE id = ?';
        return query(sql, [replyText, id]);
    },

    // Marquer la réponse de l'admin comme lue par l'utilisateur
    async markUserRead(id, userId) {
        const sql = 'UPDATE messages SET user_read = 1 WHERE id = ? AND user_id = ?';
        return query(sql, [id, userId]);
    },

    // Compter les réponses d'admin non lues par l'utilisateur
    async getUnreadUserCount(userId) {
        const sql = 'SELECT COUNT(*) as count FROM messages WHERE user_id = ? AND admin_reply IS NOT NULL AND user_read = 0';
        const res = await query(sql, [userId]);
        return res[0]?.count || 0;
    },

    // Compter les messages utilisateurs non lus pour les administrateurs
    async getUnreadAdminCount() {
        const sql = 'SELECT COUNT(*) as count FROM messages WHERE is_read = 0';
        const res = await query(sql);
        return res[0]?.count || 0;
    },

    // Marquer un message comme lu
    async markAsRead(id) {
        const sql = 'UPDATE messages SET is_read = 1 WHERE id = ?';
        return query(sql, [id]);
    },

    // Trouver un message par son ID
    async findById(id) {
        const sql = 'SELECT * FROM messages WHERE id = ?';
        const res = await query(sql, [id]);
        return res[0] || null;
    },

    // Répondre à une conversation en tant qu'utilisateur (Membre)
    async userReply(id, userId, updatedContent) {
        const sql = 'UPDATE messages SET content = ?, admin_reply = NULL, replied_at = NULL, is_read = 0, user_read = 1 WHERE id = ? AND user_id = ?';
        return query(sql, [updatedContent, id, userId]);
    },

    // Supprimer un message
    async delete(id) {
        const sql = 'DELETE FROM messages WHERE id = ?';
        return query(sql, [id]);
    }
};

export default Message;
