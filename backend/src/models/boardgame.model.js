import { query } from '../config/db.js';

const BoardGame = {
    // Récupérer tous les jeux de société triés par nom
    async findAll() {
        const sql = 'SELECT * FROM board_games ORDER BY name ASC';
        return query(sql);
    },

    // Créer un jeu de société
    async create({ name, min_players, max_players, play_time, category, description, image_url, rules_url }) {
        const sql = `
            INSERT INTO board_games (name, min_players, max_players, play_time, category, description, image_url, rules_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [
            name, 
            min_players, 
            max_players, 
            play_time, 
            category, 
            description, 
            image_url, 
            rules_url
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
            rules_url 
        };
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
