import { query } from '../config/db.js';

// --- GESTION DES RÉSERVATIONS ---

// Récupérer toutes les réservations
export const getAllReservations = async (req, res) => {
    try {
        const sql = `
            SELECT r.*, u.email, u.firstname, u.lastname, rm.name as tableName
            FROM reservations r
            JOIN users u ON r.user_id = u.id
            JOIN rooms rm ON r.room_id = rm.id
            ORDER BY r.start_time DESC
        `;
        const reservations = await query(sql);
        res.json(reservations);
    } catch (error) {
        console.error("Erreur admin récup réservations :", error);
        res.status(500).json({ error: "Impossible de charger les réservations." });
    }
};

// Mettre à jour le statut d'une réservation (CONFIRMED, CANCELLED...)
export const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ error: "Statut invalide." });
        }

        const sql = 'UPDATE reservations SET status = ? WHERE id = ?';
        await query(sql, [status, id]);
        res.json({ message: "Statut de la réservation mis à jour !" });
    } catch (error) {
        console.error("Erreur modif réservation :", error);
        res.status(500).json({ error: "Erreur lors de la modification de la réservation." });
    }
};

// Supprimer une réservation
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM reservations WHERE id = ?';
        await query(sql, [id]);
        res.json({ message: "Réservation supprimée." });
    } catch (error) {
        console.error("Erreur suppression réservation :", error);
        res.status(500).json({ error: "Erreur lors de la suppression." });
    }
};


// --- GESTION DES UTILISATEURS ---

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const sql = 'SELECT id, email, firstname, lastname, role, created_at FROM users ORDER BY created_at DESC';
        const users = await query(sql);
        res.json(users);
    } catch (error) {
        console.error("Erreur admin récup utilisateurs :", error);
        res.status(500).json({ error: "Impossible de charger les utilisateurs." });
    }
};

// Mettre à jour le rôle d'un utilisateur (USER <-> ADMIN)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ error: "Rôle invalide." });
        }

        // Empêcher un admin de s'auto-rétrograder pour éviter de bloquer le système
        if (Number(id) === req.user.id && role === 'USER') {
            return res.status(400).json({ error: "Vous ne pouvez pas retirer vos propres droits administrateur." });
        }

        const sql = 'UPDATE users SET role = ? WHERE id = ?';
        await query(sql, [role, id]);
        res.json({ message: "Rôle de l'utilisateur mis à jour !" });
    } catch (error) {
        console.error("Erreur modif rôle utilisateur :", error);
        res.status(500).json({ error: "Erreur de modification." });
    }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number(id) === req.user.id) {
            return res.status(400).json({ error: "Vous ne pouvez pas supprimer votre propre compte admin." });
        }

        const sql = 'DELETE FROM users WHERE id = ?';
        await query(sql, [id]);
        res.json({ message: "Utilisateur supprimé." });
    } catch (error) {
        console.error("Erreur suppression utilisateur :", error);
        res.status(500).json({ error: "Erreur lors de la suppression." });
    }
};


// --- CRÉATION & SUPPRESSION DE TOURNOIS ---

// Créer un nouveau tournoi
export const createTournament = async (req, res) => {
    try {
        const { name, game, date, capacity, price, description } = req.body;

        if (!name || !game || !date || !capacity) {
            return res.status(400).json({ error: "Nom, jeu, date et capacité requis." });
        }

        const sql = `
            INSERT INTO tournaments (name, game, date, capacity, price, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [
            name,
            game,
            date, // format YYYY-MM-DD HH:MM:ss
            capacity,
            price || 0.00,
            description || null
        ]);

        res.status(201).json({ message: "Tournoi créé avec succès !", tournamentId: result.insertId });
    } catch (error) {
        console.error("Erreur création tournoi :", error);
        res.status(500).json({ error: "Erreur de création du tournoi." });
    }
};

// Supprimer un tournoi
export const deleteTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM tournaments WHERE id = ?';
        await query(sql, [id]);
        res.json({ message: "Tournoi supprimé." });
    } catch (error) {
        console.error("Erreur suppression tournoi :", error);
        res.status(500).json({ error: "Erreur de suppression." });
    }
};

// --- GESTION DES JEUX DE SOCIÉTÉ ---

// Créer un nouveau jeu de société
export const createBoardGame = async (req, res) => {
    try {
        const { name, min_players, max_players, play_time, category, description, image_url, rules_url } = req.body;

        if (!name || !min_players || !max_players || !play_time || !category) {
            return res.status(400).json({ error: "Nom, joueurs (min/max), durée et catégorie requis." });
        }

        const sql = `
            INSERT INTO board_games (name, min_players, max_players, play_time, category, description, image_url, rules_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [
            name,
            Number(min_players),
            Number(max_players),
            Number(play_time),
            category,
            description || null,
            image_url || '/images/boardgames/catan.png',
            rules_url || null
        ]);

        res.status(201).json({ message: "Jeu de société ajouté avec succès !", boardGameId: result.insertId });
    } catch (error) {
        console.error("Erreur création jeu de société :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du jeu de société." });
    }
};

// Supprimer un jeu de société
export const deleteBoardGame = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM board_games WHERE id = ?';
        await query(sql, [id]);
        res.json({ message: "Jeu de société supprimé." });
    } catch (error) {
        console.error("Erreur suppression jeu de société :", error);
        res.status(500).json({ error: "Erreur de suppression." });
    }
};
