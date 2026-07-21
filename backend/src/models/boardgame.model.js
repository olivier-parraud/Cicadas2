import { query } from '../config/db.js';

const BoardGame = {
    // Récupérer tous les jeux de société triés par nom
    async findAll() {
        const sql = 'SELECT * FROM board_games ORDER BY name ASC';
        return query(sql);
    },

    // Créer un jeu de société
    async create({ name, min_players, max_players, play_time, category, description, image_url, rules_url, stock = 1 }) {
        const sql = `
            INSERT INTO board_games (name, min_players, max_players, play_time, category, description, image_url, rules_url, stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [
            name, 
            min_players, 
            max_players, 
            play_time, 
            category, 
            description, 
            image_url, 
            rules_url,
            stock !== undefined ? stock : 1
        ]);
        return { 
            id: result.insertId, 
            name, 
            min_players, 
            max_players, 
            play_time, 
            category, 
            description, 
            image_url, 
            rules_url,
            stock
        };
    },

    // Modifier un jeu de société
    async update(id, { name, min_players, max_players, play_time, category, description, image_url, rules_url, stock = 1 }) {
        const sql = `
            UPDATE board_games 
            SET name = ?, min_players = ?, max_players = ?, play_time = ?, category = ?, description = ?, image_url = ?, rules_url = ?, stock = ?
            WHERE id = ?
        `;
        return query(sql, [
            name, 
            min_players, 
            max_players, 
            play_time, 
            category, 
            description, 
            image_url, 
            rules_url, 
            stock,
            id
        ]);
    },

    // Modifier uniquement le stock d'un jeu
    async updateStock(id, stock) {
        const sql = 'UPDATE board_games SET stock = ? WHERE id = ?';
        return query(sql, [Math.max(0, parseInt(stock, 10)), id]);
    },

    // Supprimer un jeu de société par son ID
    async delete(id) {
        const sql = 'DELETE FROM board_games WHERE id = ?';
        return query(sql, [id]);
    },

    // Supprimer tous les jeux de société (pour réimportation)
    async deleteAll() {
        const sql = 'DELETE FROM board_games';
        return query(sql);
    }
};

export default BoardGame;
